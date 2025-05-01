import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    c_status:string;

    @IsNumber()
    @IsNotEmpty()
    c_typeRoom:number;  

    @IsNumber()
    @IsNotEmpty()
    c_hotel:number;
    
}