import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create.payment.dto';
import { PaymentstatusService } from '../paymentStatus/paymentstatus.service';
import { AvalaiblesmethodService } from '../avalaiblesMethod/avalaiblesmethod.service';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository:Repository<Payment>,
        private readonly paymentStatusService:PaymentstatusService,
        private readonly avalaiblesMethodService:AvalaiblesmethodService
    ){}

    async getAllPayments():Promise<Payment[]>{
        try {
            const payments=await this.paymentRepository.find();
            if(!payments){
                throw new Error('No hay pagos aun')
            }
            return payments;
        } catch (error) {
            return error;
        }
    }


    ///-------------------------------modificar en caso de configurar los pagos------------------------------------------///////////////////
    async createPayment(payment:CreatePaymentDto):Promise<Payment>{
        try {
            if(!payment.status){
                throw new NotFoundException('el pago no se pudo completar')
            }
            const paymentStatus=await this.paymentStatusService.getPaymentStatusById(payment.status.id)
            if(!paymentStatus){
                throw new NotFoundException('no existe el estado de pago')
            }
           const method=await this.avalaiblesMethodService.getMethodById(payment.method.id);
           if(!method){
            throw new NotFoundException('el metodo de pag no es valido o no existe')
           }
           const savedPayment=this.paymentRepository.create({
            method:method,
            status:paymentStatus,
            response:payment.response
           })
           return await this.paymentRepository.save(savedPayment);
        } catch (error) {
            return error;
        }
    }
}
