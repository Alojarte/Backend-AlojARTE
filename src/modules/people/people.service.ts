import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entity/people.entity';
import { Repository } from 'typeorm';
import { CreatePeopleDto } from './dto/createPeople.dto';

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
}
