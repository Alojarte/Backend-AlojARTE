import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeDni } from './entity/typeDni.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CreateTypeDniDto } from './dto/createTypeDni.dto';

@Injectable()
export class TypedniService {
    constructor (
        @InjectRepository(TypeDni)
        private readonly typeDniRepository: Repository<TypeDni>
    ){}

    async getAllType():Promise<any>{
        try {
            const types=await this.typeDniRepository.find();
            if(types.length>0){
                return types;
            }
            return new MessageDto('no se encontraron tipos de Dni');
        } catch (error) {
            return new MessageDto(error);
        }
        
    }

    async getTypeById(id:number):Promise<any>{
        try {
            if(!id){
                return new MessageDto('no se encontro el parametro id')
            }
            const type=await this.typeDniRepository.findOne({where:{id:id}});
            if(!type){
                 return new MessageDto('no se encontro el tipo de Dni')
            }
            return type
        } catch (error) {
            return new MessageDto(error);
        }
    }

    async createType(typeDni: CreateTypeDniDto):Promise<any>{
        try {
            if(!typeDni){
                return new MessageDto('no se encontro el parametro')
            }
            const exists=await this.typeDniRepository.findOne({where:{typeDni: (typeDni.typeDni).toLocaleLowerCase()}})
            if(exists){
                return new MessageDto('el tipo de Dni ya existe')
            }
            const newType=this.typeDniRepository.create({typeDni:(typeDni.typeDni).toLowerCase()})
            await this.typeDniRepository.save(newType);
            return new MessageDto('tipo de Dni creado')
        } catch (error) {
            return new MessageDto(error);
        }
    }
}
