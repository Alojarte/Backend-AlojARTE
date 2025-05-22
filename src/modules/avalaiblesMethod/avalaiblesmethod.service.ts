import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvalaibleMethod } from './entity/avalaiblesmethod.entity';
import { Repository } from 'typeorm';
import { CreateAvalaibleMethodDto } from './dto/create.method.dto';

@Injectable()
export class AvalaiblesmethodService {
    constructor(
        @InjectRepository(AvalaibleMethod)
        private readonly avaliblesMethodRepository:Repository<AvalaibleMethod>
    ){}

    async getAllMathods():Promise<any>{
        try {
            const methods=await this.avaliblesMethodRepository.find();
            if(!methods || methods.length==0){
                throw new NotFoundException('aun no hay metodos de pago')
            }
            return methods;
        } catch (error) {
            return error;
        }
    }

    async getMethodById(id:number):Promise<any>{
        try {
            const method=this.avaliblesMethodRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!method){
                throw new NotFoundException('no existe el metodo de pago escogido')
            }
            return method;
        } catch (error) {
            return error;
        }
    }

    async getMethodByName(name:string):Promise<any>{
        try {
            const method=this.avaliblesMethodRepository.findOne({
                where:{
                    name:name
                }
            });
            if(!method){
                throw new NotFoundException('no existe el metodo de pago escogido')
            }
            return method;
        } catch (error) {
            return error;
        }
    }

    async createMethod(methodo:CreateAvalaibleMethodDto):Promise<any>{
        try {
            const existMethod=await this.avaliblesMethodRepository.findOne({
                where:{
                    name:(methodo.name).toLowerCase()
                }
            });
            if(existMethod){
                throw new NotFoundException('el metodo ya existe');
            };
            const createMethod=await this.avaliblesMethodRepository.create({
                name :(methodo.name).toLowerCase(),
                description:methodo.description
            });
            return await this.avaliblesMethodRepository.save(createMethod);
        } catch (error) {
            return error;
        }
    }
}
