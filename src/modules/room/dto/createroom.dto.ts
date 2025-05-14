import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RoomStatusEntity } from "src/modules/statusroom/entity/roomstatus.entity";

export class CreateRoomDto{
  @IsString()
  @IsNotEmpty()
    c_number:string;
  
    @IsNumber()
    @IsNotEmpty()
    c_price:number;

    @IsNumber()
    @IsNotEmpty()
    c_capacity:number;
  
    @IsString()
    @IsNotEmpty()
    c_status:RoomStatusEntity;

    @IsNumber()
    @IsNotEmpty()
    c_typeRoom:number;  

    @IsNumber()
    @IsNotEmpty()
    c_hotel:number;
    
}