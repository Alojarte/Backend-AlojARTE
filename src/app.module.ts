import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constants';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypedniModule } from './modules/typeDni/typedni.module';
import { CloudinaryModule } from './core/cloudinary/cloudinary.module';
import { RoomModule } from './modules/room/room.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { HotelimageModule } from './modules/hotelImage/hotelimage.module';
import { TyperoomModule } from './modules/typeRoom/typeroom.module';
import { RoomimageModule } from './modules/roomImage/roomimage.module';
import { RoleSeederService } from './config/sederservice/sederService';
import { RoleSeederModule } from './config/sederservice/seeder.module';
import { StatusroomModule } from './modules/statusroom/statusroom.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { ReservationroomModule } from './modules/reservationRoom/reservationroom.module';
import { PaymentstatusModule } from './modules/paymentStatus/paymentstatus.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AvalaiblesmethodModule } from './modules/avalaiblesMethod/avalaiblesmethod.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:'.env',
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    useFactory:(configService: ConfigService)=>({
      type: 'mysql',
      host: configService.get(DB_HOST),
      port: configService.get(DB_PORT),
      username: configService.get(DB_USER),
      password: configService.get(DB_PASSWORD),
      database: configService.get(DB_DATABASE),
      entities: [__dirname+'/**/*.entity{.ts,.js}'],
      synchronize:true,
      logging:false,
    }),
    inject:[ConfigService]
  }),
  UserModule,
  AuthModule,
  TypedniModule,
  CloudinaryModule,
  RoomModule,
  HotelModule,
  HotelimageModule,
  TyperoomModule,
  RoomimageModule,
  RoleSeederModule,
  StatusroomModule,
  ReservationModule,
  ReservationroomModule,
  PaymentstatusModule,
  PaymentModule,
  AvalaiblesmethodModule  
],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
