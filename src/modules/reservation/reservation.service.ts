import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateReservationDto } from './dto/create.reservation.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository:Repository<Reservation>,
        private readonly userService:UserService,
        private readonly paymentService: PaymentService,
    ){}

    async getAll():Promise<Reservation[]>{
        try {
            const reservation=await this.reservationRepository.find({
                relations:['user','payment']
            })
            if(!reservation || reservation.length===0){
                throw new NotFoundException('No hay reservas aun')
            }
            return reservation;
        } catch (error) {
            return error;
        }
    }

    async getReservationById(id:number):Promise<Reservation>{
        try {
            const exist=await this.reservationRepository.findOne({
                where:{
                    id:id
                },
                relations:['user','payment']
            })
            if(!exist){
                throw new NotFoundException('No existe la reserva')
            }
            return exist;
        } catch (error) {
            return error;
        }
    }

//////////---------------------------------------TRABAJANDO-----------------------------------------------/////////////////
    async createReservation(reservation:CreateReservationDto):Promise<any>{
        try {
            const existUser=await this.userService.getUserById(reservation.user.id);
            const payment=await this.paymentService.createPayment(reservation.payment);
            if(!existUser){
                throw new NotFoundException('no existe el usuario')
            }
            const reservationSaved=await this.reservationRepository.create({
                user:existUser,
                total:reservation.total,
                payment:payment,
                fechaReserva:reservation.fechaReserva,
                fechaFin:reservation.fechaFin
            })

            ////implementar roomReservation 
            //probar funcionalidad
            return 'nada xd'
        } catch (error) {
            return error;
        }
    }
}
