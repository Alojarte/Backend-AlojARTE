
import { AvalaibleMethod } from "src/modules/avalaiblesMethod/entity/avalaiblesmethod.entity";
import { PaymentStatus } from "src/modules/paymentStatus/entity/paymentStatus.entity";
import { Reservation } from "src/modules/reservation/entity/reservation.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment')
export class Payment{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>PaymentStatus,(status)=>status.payment)
    status: PaymentStatus;


    @ManyToOne(()=>AvalaibleMethod,(method)=>method.payment)
    method: AvalaibleMethod;

    @Column({type:'text', nullable:true})
    response: string;

    @OneToOne(()=>Reservation,(reservation)=>reservation.payment)
    reservation:Reservation;
}