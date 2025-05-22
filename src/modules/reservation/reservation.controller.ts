import { Controller, Get } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './entity/reservation.entity';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService:ReservationService,
    ){}

    @Get('/all')
    async getAll():Promise<Reservation[]>{
        return await this.reservationService.getAll();
    }
}
