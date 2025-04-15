
import { Payment } from "src/modules/payment/entity/payment.entity";
import { ReservationRoom } from "src/modules/reservationRoom/entity/reservationRoom.entity";
import { User } from "src/modules/user/entity/user.entity";
import { ReviewReservation } from "src/modules/viewReservation/entity/viewReservation.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservation')
export class Reservation{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>User,(user)=>user.reservation)
    user: User;

    @Column({type:'date', nullable:false})
    fechaReserva:Date;

    @Column({type:'date', nullable:false})
    fechaFin:Date;

    @Column({type:'varchar', length:25, nullable:true})
    total:string;

    @OneToOne(()=>Payment,(payment)=>payment.reservation)
    @JoinColumn() 
    payment:Payment;

    @Column({type:'timestamp', default:()=>'CURRENT_TIMESTAMP'})
    createdAt:Date;

    @Column({type:'timestamp', default:()=>'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'})
    updatedAt:Date;

    @OneToMany(()=>ReservationRoom,(reservationRoom)=>reservationRoom.reservation,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    reservationRoom:ReservationRoom[];

    @OneToOne(()=>ReviewReservation,(review)=>review.reservation)
    review:ReviewReservation;

}