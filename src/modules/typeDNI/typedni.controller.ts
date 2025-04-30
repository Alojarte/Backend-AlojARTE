import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TypedniService } from './typedni.service';
import { CreateTypeDniDto } from './dto/createTypeDni.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('typedni')
export class TypedniController {

    constructor(
        private readonly typedniServiece:TypedniService
    ){}

    @Get()
    async getAlltype():Promise<any>{
        return await this.typedniServiece.getAllType();
    }
    @Get(':id')
    async getType(@Param('id')id :number):Promise<any>{
        return await this.typedniServiece.getTypeById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createType(@Body() type:CreateTypeDniDto):Promise<any>{
        return await this.typedniServiece.createType(type);
    }
}
