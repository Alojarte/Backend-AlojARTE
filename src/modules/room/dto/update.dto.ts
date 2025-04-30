import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRoomDto{
  @IsString()
 @IsOptional()
    number:string;
  
    @IsNumber()
    @IsOptional()
    price:number;

    @IsNumber()
    @IsOptional()
    capacity:number;
  
    @IsString()
    @IsOptional()
    status:string;

    @IsNumber()
    @IsOptional()
    typeRoom:number;  

    @IsNumber()
    @IsOptional()
    hotel:number;
    
}