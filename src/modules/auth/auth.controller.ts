import { Body, Controller, Get, Headers, NotFoundException, Post, Put } from '@nestjs/common';
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

    @Post('login')
    async login(@Body() body:{email:string, password:string}){
        const {email, password}=body;
        return this.authService.login(email, password);
    }

    @Get('profile')
    async getUserData(@Headers('authorization')authHeader:string){
        const token = authHeader?.replace('Bearer ', '');
        if(!token){
            throw new NotFoundException('token no valido');
        }
        const {email,sub,rol}=await this.jwtService.verifyAsync(token)

        const user=await this.authService.profile(sub);
        return user;
    }
}
