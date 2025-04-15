import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Rol } from '../rol/entity/rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { MessageDto } from 'src/common/message.dto';
import { MailService } from 'src/core/mail/mailer.service';
import { ActUserDto } from '../user/dto/actUser.dto';
import * as optpGenerator from 'otp-generator';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private mailService:MailService,
        
        private jwtService: JwtService,
        
        private userService: UserService,

        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>
    ){}

    async register(user:CreateUserDto):Promise<MessageDto>{
        try {
            const userCreated=await this.userService.createUser(user);

            await this.mailService.sendMail(
                userCreated.email,
                'verificacion de cuenta',
                'tu codigo de verificacion es : ',
                {
                    Codigo:userCreated.verificationCode,
                    'expira en':' 20 minutos ',
                    Usuario:userCreated.people.name
                },
            )
            return new MessageDto('usuario registrado se enviara un correo con su verificacion')
        } catch (error) {
            throw error;
        }
    }

    async generateToken(user:any):Promise<{access_token:String}>{   
        user = user.user ? user.user : user;

        const payload={email:user.email, sub:user.id, rol:user.rol.name};
        const token= {
            access_token :this.jwtService.sign(payload)
        }
        return token;
    }

    async verifyAcount(user:ActUserDto){
        try {
            const userRes=await this.userService.verifyUser(user);

            const token=this.generateToken(userRes);
            return token;
        } catch (error) {
            throw error;
        }
    }
    async login(email:string, password:string){
        try {
            const user = await this.userService.validateUser(email, password)



            return await this.generateToken(user);
        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw error;
            }
            throw new InternalServerErrorException('error al procesar el login')
        }
        
    }
    
    async profile(id:number){
        try {
            const exists =await this.userService.getUserById(id);
            return exists;
        } catch (error) {
            throw error;
        }
    }

    async recoveryPass(email:string){
        try {
            const otp_code_veirfy = optpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            alphabets: false,
          });

          const user=await this.userService.getUserEmail(email)

            const userDto = new ActUserDto();
            userDto.act_Id=user.id;
            userDto.act_codeVerify = otp_code_veirfy;
            userDto.act_email = email;

            const userBd = await this.userService.updateUser(user.id, userDto);
            const token = await this.generateToken(userBd);
            const link= process.env.FRONT_URL_RECOVERY+`?token=${token.access_token}`

            //implementear envio de correo con token de recuperacion de contraseña

            await this.mailService.sendMail(
                user.email,
                'Recuperación de contraseña',
                'Tu código de Recupéracion es: ',
                {
                    Codigo: otp_code_veirfy,
                    'expira en': '20 minutos',
                    Usuario: user.people.name,
                    Message:'o puedes acceder por medio del siguinte link',
                    Link:link
                }
            );


            return new MessageDto(`se ha enviado un correo con el codigo de verificacion a ${user.email} para recuperar la contraseña`);

        } catch (error) {
            throw error;
        }
        
        
    }

    async verifyRecoryCode(user:ActUserDto){
        try {

            const userRes=await this.userService.verifyUser(user);
            
            const userCre=new ActUserDto();
            userCre.act_password=user.act_password;
            userCre.act_codeVerify='';

            const userResult=await this.userService.updateUser(userRes.id, userCre);
            const token= await this.generateToken(userResult);
            return {
                token:token
            };

        } catch (error) {
            throw error;
        }

    }

    
    async verifyTokenRecovery(id:number, password:string){
        try {
            const user= await this.userService.getUserById(id);
            if(!user){
                throw new UnauthorizedException('el usuario no existe')
            }
            console.log('user');
            console.log(user)
            const userDto=new ActUserDto();
            if(!user.verificationCode){
                throw new UnauthorizedException(' no existe una solicitud de recuperacion')
            }
            userDto.act_password=password;
            userDto.act_codeVerify='';
            
            const result=await this.userService.updateUser(id, userDto);
            return result;
        } catch (error) {
            throw error;
        }
    }


}
