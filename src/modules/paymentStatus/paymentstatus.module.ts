import { Module } from '@nestjs/common';
import { PaymentstatusController } from './paymentstatus.controller';
import { PaymentstatusService } from './paymentstatus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatus } from './entity/paymentStatus.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PaymentStatus])],
  controllers: [PaymentstatusController],
  providers: [PaymentstatusService],
  exports:[PaymentstatusService]
})
export class PaymentstatusModule {}
