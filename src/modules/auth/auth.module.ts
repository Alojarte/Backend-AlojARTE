import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../rol/entity/rol.entity';
import { UserModule } from '../user/user.module';
import { MailModule } from 'src/core/mail/mail.module';
import { jwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get('JWT_SECRET'),
        signOptions:{
          expiresIn:'30m'
        }
      })
    }),
    TypeOrmModule.forFeature([Rol])
    ,UserModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy]
})
export class AuthModule {}
