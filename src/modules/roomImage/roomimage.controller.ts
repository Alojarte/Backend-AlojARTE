import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomimageService } from '../roomImage/roomimage.service';
import { RoomImage } from './entity/roomImage.entity';
import { MessageDto } from 'src/common/message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('roomimage')
export class RoomimageController {
    constructor(
        private readonly roomImageService:RoomimageService
    ){}

    @Get()
    async getAllRoomImages():Promise<RoomImage[] | MessageDto>{
        return await this.roomImageService.getAllImagesRooms();
    }

    @Get(':id')
    async getRoomImageById(@Param('id')id:number):Promise<RoomImage[] | MessageDto>{
        return await this.roomImageService.getImageRoomById(id);
    }

    @Get('image/:id')
    async getImageById(@Param('id')id:number):Promise<RoomImage | MessageDto>{
        return await this.roomImageService.getImageById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async createImageRoom(@UploadedFile() photo:Express.Multer.File, @Body('id')id:number):Promise<RoomImage | MessageDto>{
        return await this.roomImageService.createImageRoom(id, photo);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteImageId(@Param('id')id:number):Promise<MessageDto>{
        return await this.roomImageService.deleteImageById(id);
    }
}
