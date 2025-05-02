import { Module } from '@nestjs/common';
import { RoomimageController } from '../roomImage/roomimage.controller';
import { RoomimageService } from '../roomImage/roomimage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomImage } from './entity/roomImage.entity';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

@Module({
  imports:[TypeOrmModule.forFeature([RoomImage])],
  controllers: [RoomimageController],
  providers: [RoomimageService, CloudinaryService]
})
export class RoomimageModule {}
