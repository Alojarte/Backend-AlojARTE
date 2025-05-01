import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createroom.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService:RoomService
    ){}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
   @Post() 
   async createRoom(@Body() user:CreateRoomDto ):Promise<any>{
       return this.roomService.createRoom(user);
   }

}
