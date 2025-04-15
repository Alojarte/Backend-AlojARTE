import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entity/people.entity';

@Module({
  exports:[PeopleService],
  imports:[TypeOrmModule.forFeature([People])],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
