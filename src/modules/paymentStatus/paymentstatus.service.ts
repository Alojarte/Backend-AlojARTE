import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from './entity/paymentStatus.entity';
import { Repository } from 'typeorm';
import { CreatePaymentStatusDto } from './dto/create.payment.status.dto';

@Injectable()
export class PaymentstatusService {
    constructor(
        @InjectRepository(PaymentStatus)
        private readonly paymentStatusRepository:Repository<PaymentStatus>
    ){}
    async getAll():Promise<PaymentStatus[]>{
        try {
            const paymentStatus=await this.paymentStatusRepository.find();
            if(!paymentStatus || paymentStatus.length===0){
                throw new Error('No hay estados de pago aun')
            }
            return paymentStatus;
        } catch (error) {
            return error;
        }
    }

    async createPaymentStatus(paymentStatus:CreatePaymentStatusDto):Promise<any>{
        try {
            const exist=await this.paymentStatusRepository.findOne({
                where:{
                    status:paymentStatus.status.toLowerCase()
                }
            });
            if(exist){
                throw new BadRequestException('el estado de pago ya existe')
            }
            const newPaymentStatus=this.paymentStatusRepository.create({
                status:(paymentStatus.status).toLowerCase()
            });
            const savePaymentStatus=await this.paymentStatusRepository.save(newPaymentStatus);
            return savePaymentStatus;
        } catch (error) {
            return error;
        }
    }

    async getPaymentStatusById(id:number):Promise<PaymentStatus>{
        try {
            const paymentStatus=await this.paymentStatusRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!paymentStatus){
                throw new NotFoundException('no existe el estado de pago')
            }
            return paymentStatus;
        } catch (error) {
            return error;
        }
    }
    async getByName(name:string):Promise<PaymentStatus>{
        try {
            const paymentStatus=await this.paymentStatusRepository.findOne({
                where:{
                    status:name.toLowerCase()
                }
            });
            if(!paymentStatus){
                throw new NotFoundException('no existe el estado de pago')
            }
            return paymentStatus;
        } catch(error){
            return error;
        }
    }
}
