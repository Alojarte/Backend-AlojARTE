import { Injectable, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { PeopleService } from '../people/people.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs'
import * as optpGenerator from 'otp-generator'
import { ConfigService } from '@nestjs/config';
import { ActUserDto } from './dto/actUser.dto';
import { ActPeopleDto } from '../people/dto/actPeople.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private peopleService: PeopleService
    ){}

    async createUser(createUserDto: CreateUserDto) {
        const salt=await bcrypt.genSalt(10);
        const emailSaneado=createUserDto.cre_email.toLocaleLowerCase().trim();
        createUserDto.cre_email=emailSaneado;
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.cre_email }
        });

        if (existingUser) {
            throw new ConflictException('El email ya existe');
        }

        const peopleData = createUserDto.people;

        const people = await this.peopleService.createPeople(peopleData);

        const hashedPassword = await bcrypt.hash(createUserDto.cre_password, salt);
        const otp_code_veirfy = optpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            alphabets: false,
          });

        const user = this.userRepository.create({
            email: createUserDto.cre_email,
            password: hashedPassword,
            rol: { id: 1 },
            people: people,
            profilePhoto: '',
            verificationCode: otp_code_veirfy,
            verified: false
        });
        await this.userRepository.save(user);
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }



    async validateUser(email:string, password:string):Promise<any>{

        const emailSaneado=email.toLowerCase().trim();
        email=emailSaneado;
        
        const user= await this.userRepository.findOne({
            where:{
                email:email
            },
           relations:['rol']
        });

        if(!user){
            throw new UnauthorizedException('usuario no encontrado')
        }

        if(!user.verified){
            throw new UnauthorizedException(' aun no se ha verificado la cuenta')
        }
        if(user.verificationCode.trim()!==""){
            throw new UnauthorizedException('la cuenta se encuentra suspendida o en proceso de restauracion')
        }

        const isPasswordValid=await bcrypt.compare(password.toString(), user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Contraseña incorrecta')
        }
        const { password: _, ...result } = user;
        return result;
    }

    async verifyUser(user:ActUserDto){
        const userBd=await this.userRepository.findOne({
            where:{
                email:user.act_email
            },
            relations:['rol','people']
        })
        console.log(userBd);
        if(!userBd){
            throw new NotFoundException('el usuario no existe')
        }

        if(user.act_codeVerify!==userBd?.verificationCode || userBd?.verificationCode.trim()==""){
            throw new UnauthorizedException('codigo erroneo intenta nuevamente')
        }

        if(!userBd){
            throw new NotFoundException('la categoria no ha sido encontrada')            
        }
        userBd.verified=true;
        userBd.verificationCode='';
        return await this.userRepository.save(userBd);
        
    }

    async getUserById(id_rec:number){
        console.log(id_rec)
        try {
            const user=await this.userRepository.findOne({
               where:{
                id:id_rec
               },
               relations:['rol','people'],
            });

            if(!user){
                throw new NotFoundException('el usuario no se ha encontrado')
            }
            
            const { password: _, ...userRestant } = user;

            return userRestant;
            
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id_rec:number, user:ActUserDto){
        try {
            const userBd = await this.userRepository.findOne({
                where:{
                    id:id_rec
                },
                relations:['rol','people']
            })
            if(!userBd){
                throw new NotFoundException('el usuario no ha sido encontrado')
            }

            if(user.act_email) {
                const emailSaneado = user.act_email.toLowerCase().trim();
                const exists = await this.userRepository.createQueryBuilder('user')
                    .where('user.email = :email AND user.id != :id', {
                        email: emailSaneado,
                        id: id_rec
                    })
                    .getCount();
                if(exists){
                    throw new NotFoundException('el email ya existe en otro usuario')
                }
            }

            if(user.act_password) {
                const salt = await bcrypt.genSalt(10);
                userBd.password = await bcrypt.hash(user.act_password, salt);
            }

            if(user.act_rol) {
                userBd.rol = user.act_rol;
            }

            if(user.ac_profilePhoto) {
                userBd.profilePhoto = user.ac_profilePhoto;
            }

            if(user.act_isVerified !== undefined) {
                userBd.verified = user.act_isVerified;
            }

            if(typeof(user.act_codeVerify)!==undefined || user.act_codeVerify.trim()=='') {
                userBd.verificationCode = user.act_codeVerify;
            }
            if(user.act_people && userBd.people.id){
                const peopleData= new ActPeopleDto();
                peopleData.act_name=user.act_people.act_name || userBd.people.name;
                peopleData.act_lastname=user.act_people.act_lastname || userBd.people.lastname;
                peopleData.act_dni=user.act_people.act_dni || userBd.people.dni;
                peopleData.act_phone=user.act_people.act_phone || userBd.people.phone;
                peopleData.act_typeDni=user.act_people.act_typeDni || userBd.people.typeDni;
                peopleData.act_birthdate=user.act_people.act_birthdate || userBd.people.birthdate;
                const peopleUpdate= await this.peopleService.updatePeople(userBd.people.id,peopleData);
                userBd.people=peopleUpdate;
            }

            const updatedUser = await this.userRepository.save(userBd);
            const { password: _, ...userWithoutPassword } = updatedUser;
            return {
                user:userWithoutPassword,
                messge:'usuario actualizado con exito'
            };

        } catch (error) {
            throw error;
        }
    }

    async getUserEmail(email_rec:string){
        const user=await this.userRepository.findOne({
            where:{
                email:email_rec
            },
            relations:['rol','people']
        })

        if(!user){
            throw new NotFoundException('el usuario no se ha encontrado');
        }

        return user;
    }

    async uploadProfilePhoto(){
        
    }
  



}
