import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ActUserDto } from '../user/dto/actUser.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

    constructor(
        private authService:AuthService,
        private jwtService:JwtService
    ){}

    @Post('register')
    async register(@Body() user:CreateUserDto){
         return await this.authService.register(user);
    }   

    @Put('verify')
    async verifyAcount(@Body() user:ActUserDto){
        return await this.authService.verifyAcount(user);
    }
}
