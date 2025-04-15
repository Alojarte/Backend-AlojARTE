import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Rol } from '../rol/entity/rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { MessageDto } from 'src/common/message.dto';
import { MailService } from 'src/core/mail/mailer.service';
import { ActUserDto } from '../user/dto/actUser.dto';

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

    
}
