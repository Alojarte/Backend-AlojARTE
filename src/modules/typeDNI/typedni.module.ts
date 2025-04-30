import { Module } from '@nestjs/common';
import { TypedniController } from './typedni.controller';
import { TypedniService } from './typedni.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDni } from './entity/typeDni.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TypeDni])],
  controllers: [TypedniController],
  providers: [TypedniService]
})
export class TypedniModule {}
