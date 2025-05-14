import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol as Role } from 'src/modules/rol/entity/rol.entity';
import { RoleSeederService } from './sederService';
import { TypeDni } from 'src/modules/typeDni/entity/typeDni.entity';
import { RoomType } from 'src/modules/typeRoom/entity/typeRoom.entity';
import { RoomStatusEntity } from 'src/modules/statusroom/entity/roomstatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role,TypeDni,RoomType,RoomStatusEntity])],
  providers: [RoleSeederService],
})
export class RoleSeederModule {}
