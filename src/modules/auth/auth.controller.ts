import { Body, Controller, Get, Headers, NotFoundException, Post, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ActUserDto } from '../user/dto/actUser.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { promises } from 'dns';

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

    @Put('verify/token')
    async verifyWithToken(@Body() body:{token:string, }):Promise<any>{
        try {
            if(!body){
                throw new NotFoundException('datos no recibidos')
            }
            if(!body.token){
                throw new NotFoundException('token no valido');
            }
            const {email,sub,rol}=await this.jwtService.decode(body.token);
            return await this.authService.verifyUserByToken(sub,email,body.token);
        } catch (error) {
            return error;
        }
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

    @Post('recovery')
    async recovery(@Body() body:{email:string}){
    return await this.authService.recoveryPass(body.email);
    }

    @Put('recoveryVerified')
    async recoveryVeried(@Body() user:ActUserDto){
        return await this.authService.verifyRecoryCode(user);
    }

    @Put('recoveryPassToken')
    async recoveryPassToken(@Body() body:{token:string, password:string}){
        console.log('data redata ')
        console.log(body)
        try {
            if(!body.token){
                throw new NotFoundException('token no valido');
            }
            const {email,sub,rol}=await this.jwtService.decode(body.token);
            return await this.authService.verifyTokenRecovery(sub,body.password, body.token,email);
        } catch (error) {
            throw error;
        }
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('updateProfile')
    async updateProfile(@Body() user:ActUserDto, @Headers('authorization')authHeader:string){
        const token=authHeader?.replace('Bearer ','')
        const {email,sub,rol}=await this.jwtService.verifyAsync(token);
        return await this.authService.updateProfile(sub,user)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('updateProfilePhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async updateProfilePhoto(@UploadedFile() photo: Express.Multer.File, @Headers('authorization')authorization:string){
        const token = authorization?.replace('Bearer ','');
        if(!token) {
            throw new NotFoundException('Token no válido');
        }
        const {email,sub,rol} = await this.jwtService.verifyAsync(token);
        return await this.authService.updateProfilePhoto(sub, photo);
    }
}
