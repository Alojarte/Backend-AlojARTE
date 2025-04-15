
import { Room } from "src/modules/room/entity/room.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roomimage')
export class RoomImage{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Room,(room)=>room.roomImage,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    room:Room;

    @Column({type:'varchar', nullable:false})
    image:string;


}