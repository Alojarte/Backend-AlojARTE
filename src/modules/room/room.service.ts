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
                }
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
}
