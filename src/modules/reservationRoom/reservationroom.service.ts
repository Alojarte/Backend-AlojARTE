import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationRoom } from './entity/reservationRoom.entity';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';
import { ReservationService } from '../reservation/reservation.service';
import { CreateReservationDto } from '../reservation/dto/create.reservation.dto';
import { CreateReservationRoomDto } from './dto/create.reservationRoom.dto';

@Injectable()
export class ReservationroomService {
    constructor(
        @InjectRepository(ReservationRoom)
        private readonly reservationRoomRepository:Repository<ReservationRoom>,
        private readonly roomService:RoomService,
        private readonly reservationService:ReservationService
    ){}

    async getAll():Promise<ReservationRoom[]>{
        try {
            const reservationRooms=await this.reservationRoomRepository.find();
            if(!reservationRooms || reservationRooms.length===0){
                throw new NotFoundException('no hay reservas de habitaciones');
            }
            return reservationRooms;
        } catch (error) {
            return error;
        }
    }

    async createReservationRoom(reservationRoom:CreateReservationRoomDto):Promise<any>{
        try {
            const reservationExists=await this.reservationService.getReservationById(reservationRoom.reservation);
            const roomExists=await this.roomService.getRoomId(reservationRoom.room);
            if(!reservationExists || !roomExists){
                throw new NotFoundException('reserva o habitacion no encontrada')
            }
            const newReservationRoom=this.reservationRoomRepository.create({
                reservation:{id:reservationRoom.reservation},
                room:{id:reservationRoom.room}
            });
            const savedReservationRoom=await this.reservationRoomRepository.save(newReservationRoom);
            return savedReservationRoom;
        } catch (error) {
            return error;
        }
    }
}
