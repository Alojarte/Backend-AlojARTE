
import { Payment } from "src/modules/payment/entity/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('avalaiblesmethodpayment')
export class AvalaibleMethod{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'varchar', length:100, nullable:false})
    name:string;

    @Column({type:'text', nullable:true})
    description:string;

    @OneToMany(()=>Payment,(payment)=>payment.method,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    payment:Payment[];
}