import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { TyperoomService } from '../typeRoom/typeroom.service';
import { RoomType } from '../typeRoom/entity/typeRoom.entity';
import { HotelModule } from '../hotel/hotel.module';
import { StatusroomService } from '../statusroom/statusroom.service';
import { RoomStatusEntity } from '../statusroom/entity/roomstatus.entity';

@Module({
  controllers: [RoomController],
  providers: [RoomService, TyperoomService,StatusroomService],
  imports:[TypeOrmModule.forFeature([Room, RoomType, RoomStatusEntity]), HotelModule],
  exports:[RoomService]
})
export class RoomModule {}
