import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRoomDto{
  @IsString()
 @IsOptional()
    up_number:string;
  
    @IsNumber()
    @IsOptional()
    up_price:number;

    @IsNumber()
    @IsOptional()
    up_capacity:number;
  
    @IsString()
    @IsOptional()
    up_status:string;

    @IsNumber()
    @IsOptional()
    up_typeRoom:number;  

    @IsNumber()
    @IsOptional()
    up_hotel:number;
    
}