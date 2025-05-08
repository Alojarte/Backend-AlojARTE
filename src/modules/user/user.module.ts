import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { PeopleModule } from '../people/people.module';
import { Rol } from '../rol/entity/rol.entity';

@Module({
  exports:[UserService],
  imports:[TypeOrmModule.forFeature([User,Rol]),PeopleModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
