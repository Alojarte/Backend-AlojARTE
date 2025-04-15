
import { Reservation } from "src/modules/reservation/entity/reservation.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reviewreservation')
export class ReviewReservation{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(()=>Reservation,(reservation)=>reservation.review)
    @JoinColumn()
    reservation:Reservation;

    @Column({type:'varchar', nullable:false})
    mensaje:string;

    @Column({type:'float', nullable:false})
    calificacion: number;

    @Column({type:'timestamp', default:()=>'CURRENT_TIMESTAMP'})
    createdAt:Date;

    @Column({type:'timestamp', default:()=>'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'})
    updatedAt:Date;
}