import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateRoomType{

   @IsString()
   @IsOptional()
    up_type:string;

   @IsString()
   @IsOptional()
    up_description:string;

   
    
}