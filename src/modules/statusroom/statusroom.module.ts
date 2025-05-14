import { Module } from '@nestjs/common';
import { StatusroomController } from './statusroom.controller';
import { StatusroomService } from './statusroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStatusEntity } from './entity/roomstatus.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RoomStatusEntity])],
  controllers: [StatusroomController],
  providers: [StatusroomService],
  exports:[StatusroomService]
})
export class StatusroomModule {}
