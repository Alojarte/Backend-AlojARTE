import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Payment } from "src/modules/payment/entity/payment.entity";
import { CreateReservationRoomDto } from "src/modules/reservationRoom/dto/create.reservationRoom.dto";
import { User } from "src/modules/user/entity/user.entity";


export class CreateReservationDto{

    @IsNotEmpty()
    user: User;

    @IsNotEmpty()
    fechaReserva:Date;

    @IsNotEmpty()
    fechaFin:Date;

    @IsNotEmpty()
    @IsString()
    total:string;

    @IsNotEmpty()
    payment:Payment;


    @IsOptional()
    createdAt:Date;

    @IsOptional()
    updatedAt:Date;

    @IsNotEmpty()
    reservationRoom:CreateReservationRoomDto[];


}