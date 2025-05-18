import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RoomType } from '../typeRoom/entity/typeRoom.entity';
import { CreateRoomType } from './dto/createTypeRoom.dto';
import { UpdateRoomType } from './dto/updateTypeRoom.dto';


@Injectable()
export class TyperoomService {
    constructor(
        @InjectRepository(RoomType)
        private readonly typeRoomRepository: Repository<RoomType>
    ) {}

    async getAllTypeRoom():Promise<any>{
        try {
            const typeRoom= await this.typeRoomRepository.find();
            if(!typeRoom){
                throw new NotFoundException('no se han encontrado los tipos de habitacion')
            };
            return typeRoom;
        } catch (error) {
            return error.response;
        }
    }
    async getTypeRoomId(id:number):Promise<any>{
        try {
            
            const type=await this.typeRoomRepository.findOneBy({id:id});
           
            if(!type){
                throw new NotFoundException(' no se encontro el tipo de habitacion')
            }
            return type;
        } catch (error) {
            return error.response;
        }
    }

    async createTypeRoom(typeRoom:CreateRoomType):Promise<any>{
        try {
            if(!typeRoom){
                throw new NotFoundException('el tipo de habitacion es requerido')
            };
            typeRoom.c_type=typeRoom.c_type.toLowerCase();
            const exist=await this.typeRoomRepository.findOne({
                where:{
                    type:typeRoom.c_type
                }
            });
            if(exist){
                throw  new NotFoundException('el tipo de habitacion ya existe')
            }
            const newTypeRoom= this.typeRoomRepository.create({
                type:typeRoom.c_type,
                description:typeRoom.c_description,
            })
            return await this.typeRoomRepository.save(newTypeRoom);
        } catch (error) {
            return error
        }
    }

    async updateTypeRoom(id:number, typeRoom:UpdateRoomType):Promise<any>{
        try {
            if(!typeRoom){
                throw new NotFoundException('el tipo de habitacion es requerido')
            }
            typeRoom.up_type=typeRoom.up_type.toLowerCase();
            const exist=await this.typeRoomRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!exist){
                throw new NotFoundException('no se encontro el tipo de habitacion')
            };
            const existType=await this.typeRoomRepository.findOne({
                where:{
                    type:typeRoom.up_type,
                    id:Not(id)
                }
            });
            if(existType){
                throw new NotFoundException('el tipo de habitacion ya existe')
            }

            exist.type=typeRoom.up_type ?? exist.type;
            exist.description=typeRoom.up_description ?? exist.description;
            return await this.typeRoomRepository.save(exist);

        } catch (error) {
            return error;
        }
    }
}

