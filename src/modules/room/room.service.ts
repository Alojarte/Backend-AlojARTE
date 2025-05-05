import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { Not, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createroom.dto';
import { RoomType } from '../typeRoom/entity/typeRoom.entity';
import { Hotel } from '../hotel/entity/hotel.entity';
import { UpdateRoomDto } from './dto/update.dto';
import { TyperoomService } from '../typeRoom/typeroom.service';
import { HotelService } from '../hotel/hotel.service';
import { FilterRoomDto } from './dto/filterRoom.dto';
import { RoomStatusEnum } from './dto/enumRoomState';

@Injectable()
export class RoomService {
    constructor(
  @InjectRepository( Room )
   private readonly roomRepository: Repository<Room>,
   private readonly typeRoomService: TyperoomService,
   private readonly hotelService:HotelService
    ) {}

    async getRooms():Promise<any>{
        try {
            const rooms=await this.roomRepository.find({
                relations:['typeRoom','hotel']
            })
            if(!rooms){
                throw new BadRequestException({
                    message:'no se encontrarron habitaciones',
                    status:404
                })
            };
            const cleanedRooms = rooms.map((room) => {
                const { hotel, ...restRoom } = room;
                const { room: _, ...cleanHotel } = hotel;
                return {
                  ...restRoom,
                  hotel: cleanHotel,
                };
              });
            return cleanedRooms;
        } catch (error) {
            return error;
        }
    }

    async getRoomId(id:number):Promise<any>{
        try {
            const res=await this.roomRepository.findOne({
                where:{
                    id:id
                },
                relations:['typeRoom',]
            });
            if(!res){
                throw new NotFoundException({
                    message:'no se encontro la habitacion',
                    status:404
                });
            };
            return res;
        } catch (error) {
            return error;
        }
    }

    
    async createRoom(room: CreateRoomDto): Promise<any> {
       try {
        if(!room ){
            return {
                message:"Room is required",
                status:400
            }
        }
        const exist=await this.roomRepository.findOneBy({number:room.c_number})
        if(exist){
            return {
                message:"Room already exist",
                status:400
            }
        }
        const typeRoom=await this.typeRoomService.getTypeRoomId(room.c_typeRoom);
        if(!typeRoom.id){
            throw new NotFoundException('el tipo de habitacion no existe')
        }

        const hotel=await this.hotelService.getHotelById(room.c_hotel);
        if(!hotel.id){
            throw new NotFoundException('el hotel no existe')
        }

        const newRoom=await this.roomRepository.create(
            {
              number:room.c_number,
              price:room.c_price,
              capacity:room.c_capacity,
              status:room.c_status,
              typeRoom:typeRoom,
              hotel:hotel, 
            }
        )
        
       const saved=await this.roomRepository.save(newRoom)
       const { hotel: { room: _, ...hotelWithoutRooms } = {}, ...roomData } = saved;

            const result = {
            ...roomData,
            hotel: hotelWithoutRooms,
            };

            return result;
       } catch (error) {
        return error;
       }
    }
    async updateRoom(id:number,room:UpdateRoomDto):Promise<any>{
       try {
        console.log("actualizar habutacion");
        if (!room){
            throw new NotFoundException("la habitacion es requerida")
        }
        const exist=await this.roomRepository.findOneBy({id:id})
        if(!exist){
            throw new NotFoundException("no se encontro la habitacion")
        };
        const existNumber=await this.roomRepository.findOne({
            where:{
                number:room.up_number,
                id:Not(id)
            }
        });
        if(existNumber){
            throw new NotFoundException("el numero de habitacion ya existe")
        }
        const tipoHabitacion= await this.typeRoomService.getTypeRoomId(room.up_typeRoom);
        if(!tipoHabitacion.id){
            throw new NotFoundException('el tipo de habitacion no es valido');
        }
        const hotel= await this.hotelService.getHotelById(room.up_hotel);
        console.log(hotel)
        if(!hotel.id){
            throw new NotFoundException('el hotel no existe')
        }

        exist.capacity=room.up_capacity || exist.capacity;
        exist.price=room.up_price || exist.price;
        exist.status=room.up_status || exist.status;
        exist.number=room.up_number || exist.number;
        exist.typeRoom=tipoHabitacion.id || exist.typeRoom;
        exist.hotel=hotel || exist.hotel;
        const saved= await this.roomRepository.save(exist)
        const { hotel: { room: _, ...hotelWithoutRooms } = {}, ...roomData } = saved;

            const result = {
            ...roomData,
            hotel: hotelWithoutRooms,
            };
            return result;
       } catch (error) {
        return error;
       }
    }

    async deleteRoom(id:number):Promise<any>{
        try {
            const exist=await this.roomRepository.findOneBy({id:id});
            if(!exist){
                throw new NotFoundException({
                    message:'no se encontro la habitacion',
                    status:404
                })
            };
            await this.roomRepository.delete(id);
            return{
                message:`la habitacion con ${id} fue eliminada correctamente`,
                status:200
            }
        } catch (error) {
            return error;
        }
    }

    async getRoomWithFilters(filter: FilterRoomDto): Promise<any> {
        try {
            if (!filter) {
                throw new BadRequestException({
                    message: 'No se encontraron los filtros',
                    status: 400
                });
            }
    
            const {
                f_typeRoomId,
                f_hotel,
                f_priceMAx,
                f_priceMin,
                f_capacityMax,
                f_capacityMin,
                f_priceOrder, //sera  'ASC' o 'DESC'
                f_status
            } = filter;
    
            const query = this.roomRepository.createQueryBuilder('room')
                .leftJoinAndSelect('room.typeRoom', 'typeRoom')
                .leftJoinAndSelect('room.hotel', 'hotel');
    
            if (f_typeRoomId) {
                const typeRoom = await this.typeRoomService.getTypeRoomId(f_typeRoomId);
                if (!typeRoom?.id) {
                    throw new NotFoundException('El tipo de habitación no existe');
                }
                query.andWhere('typeRoom.id = :typeRoomId', { typeRoomId: f_typeRoomId });
            }
    
            if (f_hotel) {
                const hotel = await this.hotelService.getHotelById(f_hotel);
                if (!hotel?.id) {
                    throw new NotFoundException('El hotel no existe');
                }
                query.andWhere('hotel.id = :hotelId', { hotelId: f_hotel });
            }
    
            if (f_priceMin) {
                query.andWhere('room.price >= :priceMin', { priceMin: f_priceMin });
            }
    
            if (f_priceMAx) {
                query.andWhere('room.price <= :priceMax', { priceMax: f_priceMAx });
            }
    
            if (f_capacityMin) {
                query.andWhere('room.capacity >= :capacityMin', { capacityMin: f_capacityMin });
            }
    
            if (f_capacityMax) {
                query.andWhere('room.capacity <= :capacityMax', { capacityMax: f_capacityMax });
            }
            if (f_status) {
                query.andWhere('room.status = :status', { status: f_status });
            }
    
            if (f_priceOrder) {
                query.orderBy('room.price', f_priceOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
            }
    
            const rooms = await query.getMany();
    
            // Limpiar hotel.room para que no venga con habitaciones redundantes, objetos redundantes dentro de hotel
            const result = rooms.map(room => {
                const { hotel: { room: _, ...hotelWithoutRooms } = {}, ...roomData } = room;
                return {
                    ...roomData,
                    hotel: hotelWithoutRooms,
                };
            });
            if(result.length === 0){
                throw new NotFoundException({
                    message:'no se encontraron habitaciones',
                    status:404
                })
            }
    
            return result;
    
        } catch (error) {
            return error;
        }
    }
    
    async stateRoom():Promise<any>{
        try {
            const statuses = Object.values(RoomStatusEnum);
            if(!statuses){
                throw new NotFoundException({
                    message:'no se encontraron los estados',
                    status:404
                })
            }
            return { statuses };
        } catch (error) {
            return error;
        }
    }

    async updateState(id: number, state: string): Promise<any> {
        try {
            if(!id || !state){
                throw new NotFoundException('algunos parametros no se recibieron correctamente')
            }
            const existRoom=await this.getRoomId(id);
            if(!existRoom.id){
                throw new NotFoundException({
                    message:'no se encontro la habitacion',
                    status:404
                });
            };

            const exists = await this.stateRoom(); 
    
            const statuses = exists.statuses; 
    
            if (!statuses.includes(state)) {
                throw new Error(`Estado inválido: ${state}. Debe ser uno de: ${statuses.join(', ')}`);
            }
            existRoom.status=state;

            const updateRoom=await this.roomRepository.save(existRoom);
            
            
    
            return { 
                message: 'Estado válido', state,
                room:updateRoom
            };
        } catch (error) {
            return error;
        }
    }
    
}
