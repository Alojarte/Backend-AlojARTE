
import { Hotel } from "src/modules/hotel/entity/hotel.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('hotelimage')
export class HotelImage{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Hotel,(hotel)=>hotel.image)
    Hotel:Hotel;

    @Column({type:'varchar', nullable:false})
    image:string;
}