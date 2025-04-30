import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto{
  @IsString()
  @IsNotEmpty()
    number:string;
  
    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsNumber()
    @IsNotEmpty()
    capacity:number;
  
    @IsString()
    @IsNotEmpty()
    status:string;

    @IsNumber()
    @IsNotEmpty()
    typeRoom:number;  

    @IsNumber()
    @IsNotEmpty()
    hotel:number;
    
}