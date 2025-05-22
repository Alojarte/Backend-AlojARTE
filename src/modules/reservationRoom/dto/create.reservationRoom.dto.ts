import { IsNotEmpty, IsNumber } from "class-validator";



export class CreateReservationRoomDto{
   
    @IsNotEmpty({message:'El id de la habitacion es requerido'})
    @IsNumber()
    room:number;

    @IsNotEmpty({message:'El id de la reserva es requerido'})
    @IsNumber()
    reservation:number;
}