import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entity/hotel.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService],
  exports:[HotelService]
})
export class HotelModule {}
