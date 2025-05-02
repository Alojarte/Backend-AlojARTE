import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { TyperoomService } from '../typeRoom/typeroom.service';
import { RoomType } from '../typeRoom/entity/typeRoom.entity';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, TyperoomService],
  imports:[TypeOrmModule.forFeature([Room, RoomType]), HotelModule],
  exports:[RoomService]
})
export class RoomModule {}
