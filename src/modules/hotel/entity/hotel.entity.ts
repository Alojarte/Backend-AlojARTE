
import { HotelImage } from "src/modules/hotelImage/entity/hotelImage.entity";
import { Room } from "src/modules/room/entity/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('hotel')
export class Hotel{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', nullable:false})
    name:string;

    @Column({type:'varchar', nullable:false})
    address:string;

    @Column({type:'text', nullable:true})
    description:string;

    @Column({type:'varchar', nullable:false})
    nit:string;

    @Column({type:'varchar', nullable:false})
    phone:string;

    @OneToMany(()=>Room, (room)=>room.hotel,{cascade:true, eager:true, onDelete:'CASCADE'})
    room:Room[];

    @OneToMany(()=>HotelImage,(image)=>image.Hotel)
    image:HotelImage[];
}