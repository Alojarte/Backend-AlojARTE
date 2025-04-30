
import { People } from "src/modules/people/entity/people.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('typedni')
export class TypeDni{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', nullable:false})
    typeDni:string;

    @OneToMany(()=>People,(people)=>people.typeDni)
    people:People[];
}