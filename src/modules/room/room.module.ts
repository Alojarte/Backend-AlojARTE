import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports:[TypeOrmModule.forFeature([Room])]
})
export class RoomModule {}
