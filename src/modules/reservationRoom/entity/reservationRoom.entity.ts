
import { Reservation } from "src/modules/reservation/entity/reservation.entity";
import { Room } from "src/modules/room/entity/room.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservationroom')
export class ReservationRoom{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Room,(room)=>room.reservationRoom,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    room:Room;

    @ManyToOne(()=>Reservation,(reservation)=>reservation.reservationRoom,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    reservation:Reservation;
}