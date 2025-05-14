import { Room } from "src/modules/room/entity/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('roomstatus')
export class RoomStatusEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', length:100, nullable:false, unique:true})
    status:string;

    @OneToMany(()=>Room, (room)=>room.status,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    room:Room[];
}