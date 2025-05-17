import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { RoomStatusEntity } from "src/modules/statusroom/entity/roomstatus.entity";

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
    up_status:RoomStatusEntity;

    @IsNumber()
    @IsOptional()
    up_typeRoom:number;  

    @IsNumber()
    @IsOptional()
    up_hotel:number;
    
}