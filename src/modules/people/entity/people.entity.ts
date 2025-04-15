import { TypeDni } from "src/modules/typeDNI/entity/typeDni.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('people')
export class People{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', nullable:false})
    name:string;

    @Column({type:'varchar', nullable:true})
    lastname:string;

    @Column({type:'date',nullable:false})
    birthdate:Date;

    @ManyToOne(()=>TypeDni,(typeDni)=>typeDni.people)
    typeDni:TypeDni;

    @Column({type:'varchar', nullable:false})
    dni:string;       

    @Column({type:'varchar', nullable:false})
    phone:string;

    @Column({type:'timestamp',nullable:false, default:()=>'CURRENT_TIMESTAMP'})
    createdAt:Date;

    @Column({type:'timestamp',nullable:true, default:()=>'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt:Date;

    @OneToOne(()=>User,(user)=>user.people)
    user:User;
}