import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entity/hotel.entity';
import { Not, Repository } from 'typeorm';
import { CreateHotelDto } from './dto/createHote.dot';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Injectable()
export class HotelService {
    constructor(
        @InjectRepository(Hotel)
        private readonly hotelRepository: Repository<Hotel>
    ){}

    async getAllHotels():Promise<Hotel[]>{
        try {
            const res= await this.hotelRepository.find();
            if(res.length>0){
                return res;
            }
            throw new NotFoundException('no hay hoteles registrados')
        } catch (error) {
            return error;
        }
        
    }

    async getHotelById(id:number):Promise<Hotel | {message:string}>{
        try {
            const res= await this.hotelRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!res){
                throw new NotFoundException('hotel no encontrado');
            }
            return res;
        } catch (error) {
            return error;
        }
    }

    async createHotel(hotel:CreateHotelDto):Promise<Hotel | {message:string}>{
        try {
            if(!hotel){
                throw new BadRequestException('no se recibieron parametros para crear este hotel')
            }
            const existsNit= await this.hotelRepository.findOne({
                where:{
                    nit:hotel.c_nit
                }
            });
            if(existsNit){
                throw new NotFoundException('el hotel ya esta registrado');
            }
            const hotelSave=this.hotelRepository.create({
                name:hotel.c_name,
                address:hotel.c_address,
                description:hotel.c_description,
                nit:hotel.c_nit,
                phone:hotel.c_phone
            })
            const res=await this.hotelRepository.save(hotelSave);
            return res;
        } catch (error) {
            return error.response;
        }
    }

    async updateHotel(id:number, hotel:UpdateHotelDto):Promise<Hotel | {message:string}>{
        try {
            if(!hotel){
                throw new BadRequestException('no se recibieron parametros para actualizar este hotel')
            }
            const existshotel=await this.hotelRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!existshotel){
                throw new NotFoundException('el hotel no existe')
            }
            const existsNit= await this.hotelRepository.findOne({
                where:{
                    nit:hotel.up_nit,
                    id:Not(id)
                }
            });
            if(existsNit){
                throw new NotFoundException('el hotel ya esta registrado con ese nit')
            }
            existshotel.name= hotel.up_name ?? existshotel.name;
            existshotel.address= hotel.up_address ?? existshotel.address;
            existshotel.description= hotel.up_description || existshotel.description;
            existshotel.nit= hotel.up_nit || existshotel.nit;
            existshotel.phone= hotel.up_phone || existshotel.phone;

            return await this.hotelRepository.save(existshotel);


        } catch (error) {
            return error.response;
        }
    }

    async deleteHotel(id:number):Promise<any>{
        try {
            const existsHotel=await this.hotelRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!existsHotel){
                return new BadRequestException('el hotel no existe');
            }
            const res= await this.hotelRepository.delete(id);
            return {
                message:'el hotel fue eliminado con exito',
                status:200
            }
        } catch (error) {
            return error;
        }
    }
}
