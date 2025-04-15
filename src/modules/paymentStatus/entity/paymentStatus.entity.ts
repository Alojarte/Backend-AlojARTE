
import { Payment } from "src/modules/payment/entity/payment.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('paymentstatus')
export class PaymentStatus{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', length:25, nullable:false})
    status: string;

    @OneToMany(()=>Payment, (payment)=>payment.status)
    payment: Payment[];

}