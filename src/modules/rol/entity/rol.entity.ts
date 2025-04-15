
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class Rol{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', nullable:false})
    name:string;

    @Column({type:'varchar', nullable:true})
    description:string;

    @OneToMany(()=>User,(user)=>user.rol)
    users:User[];
}