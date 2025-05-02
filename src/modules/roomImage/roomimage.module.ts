import { Module } from '@nestjs/common';
import { RoomimageController } from '../roomImage/roomimage.controller';
import { RoomimageService } from '../roomImage/roomimage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomImage } from './entity/roomImage.entity';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';

@Module({
  imports:[TypeOrmModule.forFeature([RoomImage]), RoomModule],
  controllers: [RoomimageController],
  providers: [RoomimageService, CloudinaryService]
})
export class RoomimageModule {}
