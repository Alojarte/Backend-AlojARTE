
import { LogActivity } from "src/core/logs/entity/log.entity";
import { People } from "src/modules/people/entity/people.entity";
import { Reservation } from "src/modules/reservation/entity/reservation.entity";
import { Rol } from "src/modules/rol/entity/rol.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(()=>People,(people)=>people.user)
    @JoinColumn()
    people:People;

    @ManyToOne(()=>Rol,(rol)=>rol.users)
    rol:Rol;

    @Column({ length: 255, type:'varchar' })
    profilePhoto:string;

    @Column({ length: 100, type:'varchar' })
    email:string;

    @Column({ type:'varchar'  })
    password:string;

    @Column({ length: 10, type:'varchar' })
    verificationCode:string;

    @Column({type:'boolean', default:false})
    verified:boolean;

    @OneToMany(()=>LogActivity,(logActivity)=>logActivity.user)
    log:LogActivity[];

    @OneToMany(()=>Reservation,(reservation)=>reservation.user)
    reservation:Reservation[];
}