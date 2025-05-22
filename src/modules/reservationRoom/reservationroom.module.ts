import { Module } from '@nestjs/common';
import { ReservationroomController } from './reservationroom.controller';
import { ReservationroomService } from './reservationroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationRoom } from './entity/reservationRoom.entity';
import { RoomModule } from '../room/room.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports:[TypeOrmModule.forFeature([ReservationRoom]), RoomModule,ReservationModule],
  controllers: [ReservationroomController],
  providers: [ReservationroomService],
})
export class ReservationroomModule {}
