import { Room } from "src/modules/room/entity/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roomtype')
export class RoomType{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', nullable:false})
    type:string;

    @Column({type:'varchar', nullable:true})
    description:string;

    @OneToMany(()=>Room,(room)=>room.typeRoom)
    room:Room[];
}