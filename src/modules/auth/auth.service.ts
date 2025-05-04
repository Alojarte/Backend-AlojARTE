import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

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
import { FOLDER_PROFILE, FRONT_URL_RECOVERY, FRONT_URL_VERIFY } from 'src/config/constants';
import { User } from '../user/entity/user.entity';
import { VerifyDto } from '../user/dto/verifyData.dto';

@Injectable()
export class AuthService {
    constructor(
        private mailService:MailService,
        private jwtService: JwtService,
        private userService: UserService,
        private cloudinaryService: CloudinaryService,
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        private readonly configService:ConfigService,
    ){}


    
    async reSendEmail(id:number, asunto:string, url:string):Promise<any>{
        try {
            const userCreated= await this.userService.getUserById(id);
            if(!userCreated){
                throw new NotFoundException('el usuario no existe');
            }
            const token= await this.generateToken(userCreated);
            //verificar estos parametros de token control acces de acuerdo a si er recovery o si es verify
            const linkVerify=url+token.access_token;

            const otp_code_veirfy = optpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                alphabets: false,
              });

            const userVerify=new VerifyDto();
            userVerify.act_verificationCode=otp_code_veirfy;
            userVerify.act_expiredMin="20";
            userVerify.act_dateSend= new Date();
            userVerify.act_token = token.access_token as string;
            await this.userService.verifyData(userCreated.id,userVerify);

            await this.mailService.sendMail(
                userCreated.email,
                asunto,
                'tu codigo de verificacion es : ',
                {
                    Codigo: otp_code_veirfy,
                    'expira en': '20 minutos',
                    Usuario: userCreated.people.name,
                    Message: 'Para verificar tu cuenta, haz clic en el siguiente enlace:',
                    Link: linkVerify
                },
            )

        } catch (error) {
            return error;
        }

    }

    async register(user:CreateUserDto):Promise<MessageDto>{
        try {
            const userCreated=await this.userService.createUser(user);
            const link =this.configService.get<string>(FRONT_URL_RECOVERY);
            const token= await this.generateToken(userCreated);
            console.log('token :')
            console.log(token);
            const linkVerify=link+'verify-account?token='+token.access_token;


            const userVerify=new VerifyDto();
            userVerify.act_expiredMin="20";
            userVerify.act_dateSend= new Date();
            userVerify.act_token = token.access_token as string;
            await this.userService.verifyData(userCreated.id,userVerify);

            await this.mailService.sendMail(
                userCreated.email,
                'verificacion de cuenta',
                'tu codigo de verificacion es : ',
                {
                    Codigo: userCreated.verificationCode,
                    'expira en': '20 minutos',
                    Usuario: userCreated.people.name,
                    Message: 'Para verificar tu cuenta, haz clic en el siguiente enlace:',
                    Link: linkVerify
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
        const urlVerify=this.configService.get<string>(FRONT_URL_VERIFY);
        try {
            console.log('revisando usuario')
            const userRes=await this.userService.verifyUser(user);

            const token=this.generateToken(userRes);
            console.log('userdata res')
            console.log(userRes)
            return token;
        } catch (error) {
            if(error.response.statuss==400){
                let userA;
                if(user.act_email){
                    console.log('correo enviado')
                     userA=await this.userService.getUserEmail(user.act_email);
                }
                if(user.act_Id){
                    console.log('id enviado')
                   userA=await this.userService.getUserById(user.act_Id);
                }
                if(!userA){
                    throw new NotFoundException(' no se ha podido reenviar el correo para verificacion')
                }
                if(!urlVerify){
                    throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de verificacion de contraseña')
                }
                
                this.reSendEmail(userA.id,'verificacion de cuenta',urlVerify);
                throw new NotFoundException('el codigo de verificacion ya vencio se ha enviado otro a tu correo porfavor revisalo')
            }
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
            if(!email){
                throw new NotFoundException('no se ha reccibido el correo, verifica los datos enviados')
            }
            const urlRecovey=this.configService.get<string>(FRONT_URL_RECOVERY);
            if(!urlRecovey){
                throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de recuperacion de contraseña')
            }
            const userDto=new ActUserDto();
            userDto.act_email=email;
            const user=await this.userService.validateUserEmail(email);
            await this.reSendEmail(user.id,'restauracion de contraseña',urlRecovey)

            return new MessageDto(`se ha enviado un correo con el codigo de verificacion a ${user.email} para recuperar la contraseña`);

        } catch (error) {
            console.log('error ');
            console.log(error);
            throw error;
        }
        
        
    }

    async verifyRecoryCode(user:ActUserDto){
        const urlRecovery=this.configService.get<string>(FRONT_URL_RECOVERY);
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
            if(error.response.statuss==400){
                let userA;
                if(user.act_email){
                    console.log('correo enviado')
                     userA=await this.userService.getUserEmail(user.act_email);
                }
                if(user.act_Id){
                    console.log('id enviado')
                   userA=await this.userService.getUserById(user.act_Id);
                }
                if(!userA){
                    throw new NotFoundException(' no se ha podido reenviar el correo para verificacion')
                }
                if(!urlRecovery){
                    throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de recuperacion de contraseña')
                }
                this.reSendEmail(userA.id,'restauracion de contraseña',urlRecovery);
                throw new NotFoundException('el codigo de verificacion ya vencio se ha enviado otro a tu correo porfavor revisalo')
            }
            throw error;
        }

    }

    async verifyTokenRecovery(id:number, password:string, token:string, emailSub:string){
        const urlRecovery=this.configService.get<string>(FRONT_URL_RECOVERY);
        try {
            console.log( 'recovery with token')
            const user= await this.userService.getUserById(id);
            if(!user){
                throw new UnauthorizedException('el usuario no existe')
            }
            console.log('user');
            console.log(user)
            const userDto=new ActUserDto();
            userDto.act_email=user.email;
            userDto.act_token=token;

            const userres=await this.userService.verifyUser(userDto);
            if(!userres){
                throw new UnauthorizedException('el usuario no existe')
            }
            if(!user.verificationCode){
                throw new UnauthorizedException(' no existe una solicitud de recuperacion')
            }
            userDto.act_password=password;
            userDto.act_codeVerify='';
            
            const result=await this.userService.updateUser(id, userDto);
            const tokenResult=await this.generateToken(result);
            return tokenResult;
        } catch (error) {
            if(error.response.statuss==400){
                if(!urlRecovery){
                    throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de recuperacion de')
                }
                let userA;
                if(emailSub){
                    console.log('correo enviado')
                     userA=await this.userService.getUserEmail(emailSub);
                }
                if(id && !userA){
                    console.log('id enviado')
                   userA=await this.userService.getUserById(id);
                }
                if(!userA){
                    throw new NotFoundException(' no se ha podido reenviar el correo para verificacion')
                }
                if(!urlRecovery){
                    throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de recuperacion de contraseña')
                }
                this.reSendEmail(userA.id,'restauracion de contraseña',urlRecovery);
                throw new NotFoundException('el codigo de verificacion ya vencio se ha enviado otro a tu correo porfavor revisalo')
            }
            throw error;
        }
    }

    async updateProfile(id:number, user:ActUserDto):Promise<any>{
        try {
            const res= await this.userService.updateUser(id, user);
            const token=await this.generateToken(res.user);
            res.messge='perfil actualizado';
            
            return {
                user:res.user,
                message:res.messge,
                token:token
            };
        } catch (error) {
            return new MessageDto(error);
        }
    }

    async updateProfilePhoto(id:number, photo:Express.Multer.File):Promise<any>{
        try {
            const profileFolder= this.configService.get<string>(FOLDER_PROFILE);
            const user = await this.userService.getUserById(id);
            if(!profileFolder){
                throw new NotFoundException('error no se proporciono una carpeta para este metodo')
            }
            if(!user) {
                throw new UnauthorizedException('Usuario no encontrado');
            }

            if(user.profilePhoto) {
                const publicId = user.profilePhoto.split('/').pop()?.split('.')[0];
                if(publicId) {
                    await this.cloudinaryService.deleteImageProfilePhoto(profileFolder, publicId);
                }
            }

            const uploadResult = await this.cloudinaryService.uploadImageProfilePhoto(profileFolder, photo);
            
            const userDto = new ActUserDto();
            userDto.ac_profilePhoto = uploadResult.secure_url;
            
            const result = await this.userService.updateUser(id, userDto);
            const token = await this.generateToken(result.user);

            return {
                user: result.user,
                message: 'Foto de perfil actualizada exitosamente',
                token: token
            };

        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la foto de perfil: ' + error.message);
        }
    }


    async verifyUserByToken(id:number, email:string, token:string):Promise<any>{
        const verifyUrl=this.configService.get<string>(FRONT_URL_VERIFY)
        try {
            const userVerify= await this.userService.verifyUserById(id,email,token);
            if(userVerify instanceof NotFoundException){
                throw new NotFoundException('no se ha podido verificar el usuario, verifica los datos enviados')
            }
            if(userVerify instanceof UnauthorizedException){
                throw new UnauthorizedException(' error, puede que el usaurio ya se encuentre verificado, verifica si puedes iniciar sesion')
            }
            const tokenResult=await this.generateToken(userVerify);
            return tokenResult;
        } catch (error) {
            if(error.response.statuss==400){
                let userA;
                if(email){
                    console.log('correo enviado')
                     userA=await this.userService.getUserEmail(email);
                }else if(id){
                    console.log('id enviado')
                   userA=await this.userService.getUserById(id);
                }
                if(!verifyUrl){
                    throw new NotFoundException('no se ha podido reenviar el correo, no se encontro la url de verificacion de cuenta')
                }
                this.reSendEmail(userA.id,'verificacion de cuenta', verifyUrl);
                throw new NotFoundException('el codigo de verificacion ya vencio se ha enviado otro a tu correo porfavor revisalo')
            }
            throw error;
        }
    }


}
