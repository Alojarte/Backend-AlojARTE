import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constants';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

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
      logging:true,
    }),
    inject:[ConfigService]
  }),
  UserModule,
  AuthModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
