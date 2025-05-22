import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol as Role } from 'src/modules/rol/entity/rol.entity';
import { TypeDni } from 'src/modules/typeDni/entity/typeDni.entity';
import { RoomType } from 'src/modules/typeRoom/entity/typeRoom.entity';
import { RoomStatusEntity } from 'src/modules/statusroom/entity/roomstatus.entity';
import { PaymentStatus } from 'src/modules/paymentStatus/entity/paymentStatus.entity';
import { AvalaibleMethod } from 'src/modules/avalaiblesMethod/entity/avalaiblesmethod.entity';

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
    private readonly roomStatusRepository:Repository<RoomStatusEntity>,
    @InjectRepository(PaymentStatus)
    private readonly paymentStatusRepository:Repository<PaymentStatus>,
    @InjectRepository(AvalaibleMethod)
    private readonly avalaibleMethodRepository:Repository<AvalaibleMethod>,
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

      const countPaymentStatus=await this.paymentStatusRepository.count();
      if(countPaymentStatus===0){
        await this.paymentStatusRepository.save([
          {status:'pendiente'},
          {status:'pagado'},
          {status:'cancelado'},
          {status:'fallido'}
        ]);
        console.log('Status de pagos iniciales creados ✅');
      }

      const countAvalaibleMethod=await this.avalaibleMethodRepository.count();
      if(countAvalaibleMethod===0){
        await this.avalaibleMethodRepository.save([
          {name:'ninguno'},
          {name:'efectivo'},
          {name:'tarjeta'},
          {name:'transferencia'},
          {name:'deposito'},
        ]);
        console.log('Metodos de pago iniciales creados ✅');
      }
  }


  
}
