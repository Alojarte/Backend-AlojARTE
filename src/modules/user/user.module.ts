import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { PeopleModule } from '../people/people.module';

@Module({
  exports:[UserService],
  imports:[TypeOrmModule.forFeature([User]),PeopleModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
