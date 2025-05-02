import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TyperoomService } from './typeroom.service';
import { CreateRoomType } from './dto/createTypeRoom.dto';
import { UpdateRoomType } from './dto/updateTypeRoom.dto';

@Controller('typeroom')
export class TyperoomController {
    constructor(
        private readonly typeRoomService: TyperoomService
    ){}
    
    @Get()
    async getAll():Promise<any>{
        return await this.typeRoomService.getAllTypeRoom();
    }

    @Get(':id')
    async getById(@Param('id')id:number):Promise<any>{
        return await this.typeRoomService.getTypeRoomId(id);
    }

    @Post()
    async createTypeRoom(@Body() typeRoom:CreateRoomType):Promise<any>{
        return await this.typeRoomService.createTypeRoom(typeRoom);
    }

    @Put(':id')
    async updateTypeRoom(@Param('id') id:number, @Body() typeRoom:UpdateRoomType):Promise<any>{
        return await this.typeRoomService.updateTypeRoom(id,typeRoom);
    }
}
