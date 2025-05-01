import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateHotelDto{
    
    @IsString()
    @IsNotEmpty()
    c_name:string;

    @IsString()
    @IsNotEmpty()
    c_address:string;

    @IsString()
    @IsOptional()
    c_description:string | null;

    @IsString()
    @IsNotEmpty()
    c_nit:string;

    @IsString()
    @IsNotEmpty()
    c_phone:string;
}