import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomStatusEntity } from './entity/roomstatus.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusroomService {

    constructor(
        @InjectRepository(RoomStatusEntity)
        private readonly roomStatusRepository:Repository<RoomStatusEntity>
    ){}

    async getAllRoomStatus():Promise<any>{
        return await this.roomStatusRepository.find();
    }

    async getStatusByName(name:string):Promise<RoomStatusEntity>{
        try {
            const status=await this.roomStatusRepository.findOne({
                where:{
                    status:name
                }
            })
            if(!status){
                throw new BadRequestException('stado no encontrado, verifica los datos')
            }
            return status;
        } catch (error) {
            return error;
        }
    }
}
