import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { PaymentstatusModule } from '../paymentStatus/paymentstatus.module';
import { AvalaiblesmethodModule } from '../avalaiblesMethod/avalaiblesmethod.module';

@Module({
  imports:[TypeOrmModule.forFeature([Payment]),PaymentstatusModule,AvalaiblesmethodModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports:[PaymentService]
})
export class PaymentModule {}
