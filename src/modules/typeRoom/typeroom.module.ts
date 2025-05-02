import { Module } from '@nestjs/common';
import { TyperoomController } from '../typeRoom/typeroom.controller';
import { TyperoomService } from '../typeRoom/typeroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entity/typeRoom.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RoomType])],
  controllers: [TyperoomController],
  providers: [TyperoomService],
  exports:[TyperoomService],
})
export class TyperoomModule {}
