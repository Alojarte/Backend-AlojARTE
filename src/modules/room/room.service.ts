import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createroom.dto';
import { RoomType } from '../typeRoom/entity/typeRoom.entity';
import { Hotel } from '../hotel/entity/hotel.entity';

@Injectable()
export class RoomService {
    constructor(
  @InjectRepository( Room )
   private readonly roomRepository: Repository<Room>,
    ) {}
    
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
        const typeRoom=new RoomType();
        typeRoom.id=room.c_typeRoom; 

        const hotel=new Hotel();
        hotel.id=room.c_hotel;

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
       return await this.roomRepository.save(newRoom)
       } catch (error) {
        return error;
       }
    }
}
