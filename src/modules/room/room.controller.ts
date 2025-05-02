import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createroom.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UpdateRoomDto } from './dto/update.dto';
import { FilterRoomDto } from './dto/filterRoom.dto';

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService:RoomService
    ){}


    @Get()
    async getAllRoom():Promise<any>{
        return this.roomService.getRooms();
    }

    @Get(':id')
    async getRoomById(@Param('id')id:number):Promise<any>{
        return this.roomService.getRoomId(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
   @Post() 
   async createRoom(@Body() user:CreateRoomDto ):Promise<any>{
       return this.roomService.createRoom(user);
   }

   @UseGuards(JwtAuthGuard,RolesGuard)
   @Roles('admin')
    @Put(":id")
    async updateRoom(@Body() room:UpdateRoomDto, @Param('id')id:number):Promise<any>{
        return this.roomService.updateRoom(id,room);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteRoom(@Param('id')id:number):Promise<any>{
        return this.roomService.deleteRoom(id);
    }

    @Get('/status/room')
    async getStatusRooms():Promise<any>{
        return  this.roomService.stateRoom();
    }

    @Get('/filter/state')
    async filterRooms(@Body() filter:FilterRoomDto):Promise<any>{
        console.log('filtrando')
        return this.roomService.getRoomWithFilters(filter);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async updateStateRoom(@Param('id') id:number, @Body()body:{status:string}):Promise<any>{
        return this.roomService.updateState(id, body.status);
    }
}
