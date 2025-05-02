import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateRoomType{

   @IsString()
   @IsNotEmpty()
    c_type:string;

   @IsString()
   @IsOptional()
    c_description:string;

   
    
}