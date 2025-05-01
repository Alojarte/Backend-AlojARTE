import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/createHote.dot';
import { Hotel } from './entity/hotel.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Controller('hotel')
export class HotelController {
    constructor(
        private readonly hoteService:HotelService
    ){}

    @Get()
    async getAllHotels(){
        return await this.hoteService.getAllHotels()
    }

    @Get(':id')
    async getHotelById(@Param('id') id:number):Promise<Hotel | {message:string}>{
        return await this.hoteService.getHotelById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createHotel(@Body() hotel:CreateHotelDto):Promise<Hotel | {message:string}>{
        return await this.hoteService.createHotel(hotel);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async updateHotel(@Param('id') id:number, @Body() hotel:UpdateHotelDto):Promise<Hotel | {message:string}>{
        return await this.hoteService.updateHotel(id, hotel);
    }
}
