
import { Hotel } from "src/modules/hotel/entity/hotel.entity";
import { ReservationRoom } from "src/modules/reservationRoom/entity/reservationRoom.entity";
import { RoomImage } from "src/modules/roomImage/entity/roomImage.entity";
import { RoomType } from "src/modules/typeRoom/entity/typeRoom.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('room')
export class Room{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', length:25, nullable:false})
    number:string;
    
    @Column({type:'int', nullable:false})
    price:number;

    @Column({type:'int', nullable:false})
    capacity:number;

    @Column({type:'enum' , enum:['available','unavailable'], default:'available'})
    status:string;

    @ManyToOne(()=>RoomType,(typeRoom)=>typeRoom.room, {onDelete:'CASCADE', onUpdate:'CASCADE',   })
    typeRoom:RoomType;  

    @ManyToOne(()=>Hotel,(hotel)=>hotel.room, {onDelete:'CASCADE', onUpdate:'CASCADE',   })
    hotel:Hotel;

    @OneToMany(()=>RoomImage,(roomImage)=>roomImage.room,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    roomImage:RoomImage[];

    @OneToMany(()=>ReservationRoom,(reservationRoom)=>reservationRoom.room,{onDelete:'CASCADE', onUpdate:'CASCADE'})
    reservationRoom:ReservationRoom[];
}