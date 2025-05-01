import { Module } from '@nestjs/common';
import { HotelimageController } from './hotelimage.controller';
import { HotelimageService } from './hotelimage.service'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelImage } from './entity/hotelImage.entity';
import { HotelService } from '../hotel/hotel.service';
import { Hotel } from '../hotel/entity/hotel.entity';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

@Module({
  imports:[TypeOrmModule.forFeature([HotelImage, Hotel])],
  controllers: [HotelimageController],
  providers: [HotelimageService, HotelService,CloudinaryService]
})
export class HotelimageModule {}
