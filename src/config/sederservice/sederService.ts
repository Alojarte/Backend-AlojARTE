import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol as Role } from 'src/modules/rol/entity/rol.entity';
import { TypeDni } from 'src/modules/typeDni/entity/typeDni.entity';
import { RoomType } from 'src/modules/typeRoom/entity/typeRoom.entity';
import { RoomStatusEntity } from 'src/modules/statusroom/entity/roomstatus.entity';

@Injectable()
export class RoleSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(TypeDni)
    private readonly typeDniRepository:Repository<TypeDni>,

    @InjectRepository(RoomType)
    private readonly roomtTypeRepository:Repository<RoomType>,

    @InjectRepository(RoomStatusEntity)
    private readonly roomStatusRepository:Repository<RoomStatusEntity>
  ) {}

  async onModuleInit() {
    const count = await this.roleRepository.count();
    if (count === 0) {
      await this.roleRepository.save([
        { name: 'admin' },
        { name: 'cliente' },
      ]);
      console.log('Roles iniciales creados ✅');
    }

    const countTypeDni=await this.typeDniRepository.count();
    if(countTypeDni===0){
      await this.typeDniRepository.save([
        {typeDni:'cc'},
        {typeDni:'ti'},
        {typeDni:'ce'},
      
      ]);
      console.log('Tipos de DNI iniciales creados ✅');
    }

    const countRoomType=await this.roomtTypeRepository.count();
    if(countRoomType===0){
      await this.roomtTypeRepository.save([
        {type:'simple'},
        {type:'doble'},
        {type:'triple'},
        {type:'cuadruple'},
        {type:'suite'},
      ]);
      console.log('Tipos de habitaciones iniciales creados ✅');
    }

    const countRoomStatus=await this.roomStatusRepository.count();
    if(countRoomStatus===0){
      await this.roomStatusRepository.save([
        {status:'disponible'},
        {status:'ocupado'},
        {status:'reservado'},
        {status:'limpieza'},
        {status:'mantenimiento'},
      ]);
      console.log('Status de habitaciones iniciales creados ✅');
    }
  }
  
}
