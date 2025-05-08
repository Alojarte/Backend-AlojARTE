import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entity/people.entity';
import { Repository } from 'typeorm';
import { CreatePeopleDto } from './dto/createPeople.dto';
import { ActPeopleDto } from './dto/actPeople.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private readonly peopleRepositoy: Repository<People>

    ){}

    async createPeople(dto:CreatePeopleDto){
        const existingPeople = await this.peopleRepositoy.findOne({
            where:{
                dni:dto.cre_dni
            }
        });
        
        if(existingPeople){
            throw new ConflictException('El dni ya existe');
        }

        const people = this.peopleRepositoy.create({
            name:dto.cre_name,
            lastname:dto.cre_lastname,
            birthdate:dto.cre_birthdate,
            typeDni: { id: dto.cre_typeDni },
            dni:dto.cre_dni,
            phone:dto.cre_phone || ''
        });

        return await this.peopleRepositoy.save(people);
    }

    async updatePeople(id:number, propel:ActPeopleDto){

        try {
            const people = await this.peopleRepositoy.findOne({
                where:{
                    id:id
                }
            });
            if(!people){
                throw new NotFoundException('la persona no existe');
            }
            const peopleUpdate = Object.assign(people, {
                name: propel.act_name || people.name,
                lastname: propel.act_lastname || people.lastname,
                birthdate: propel.act_birthdate || people.birthdate,
                typeDni: propel.act_typeDni ? { id: propel.act_typeDni } : people.typeDni,
                dni: propel.act_dni || people.dni,
                phone: propel.act_phone || people.phone
            });

            return await this.peopleRepositoy.save(peopleUpdate);

        } catch (error) {
            return error;
        }
    }

    async deletePeople(id:number){
        try {
            const people = await this.peopleRepositoy.findOne({
            where:{
                id:id
                }
                });
             if(!people){
                   return null;
             }
             await this.peopleRepositoy.delete(id);
             return new MessageDto('persona eliminada con exito')
        } catch (error) {
            throw error;
        }
    }
        
}
