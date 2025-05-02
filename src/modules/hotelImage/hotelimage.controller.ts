import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelimageService } from './hotelimage.service';
import { HotelImage } from './entity/hotelImage.entity';
import { MessageDto } from 'src/common/message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('hotelimage')
export class HotelimageController {
    constructor(
        private readonly hotelImageService:HotelimageService
    ){}

    @Get()
    async getAllHotelImages():Promise<HotelImage[] | MessageDto>{
        return await this.hotelImageService.getAllHotelImages();
    }

    @Get(':id')
    async getHotelImageById(@Param('id') id:number):Promise<HotelImage | MessageDto>{
        return await this.hotelImageService.getHotelImageById(id);
    }

    @Get('/image/:id')
    async getimageById(@Param('id')id:number):Promise<any>{
        return this.hotelImageService.getImageById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async uploadImage(@UploadedFile() photo:Express.Multer.File, @Body('id')id:number):Promise<any>{
        return this.hotelImageService.uploadImageFromHotel(id, photo);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteImage(@Param('id')id:number):Promise<any>{
        return this.hotelImageService.deleteImageById(id);
    }

}
