import { Module } from '@nestjs/common';
import { AvalaiblesmethodController } from './avalaiblesmethod.controller';
import { AvalaiblesmethodService } from './avalaiblesmethod.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvalaibleMethod } from './entity/avalaiblesmethod.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AvalaibleMethod])],
  controllers: [AvalaiblesmethodController],
  providers: [AvalaiblesmethodService],
  exports:[AvalaiblesmethodService],
})
export class AvalaiblesmethodModule {}
