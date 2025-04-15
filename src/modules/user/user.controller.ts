import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService:UserService
    ){}

    @Post()
    async createUser(@Body() user: CreateUserDto){
        return await this.userService.createUser(user);
    }

    //ejemplo de manejo de rutas protegidas backend
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get(':id')
    async getUserById(@Param('id') id:number):Promise<any>{
        return await this.userService.getUserById(id);
    }
}
