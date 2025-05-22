import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { UserModule } from '../user/user.module';
import { PaymentstatusModule } from '../paymentStatus/paymentstatus.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports:[TypeOrmModule.forFeature([Reservation]),UserModule,PaymentstatusModule,PaymentModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports:[ReservationService]
})
export class ReservationModule {}
