import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateHotelDto{
    
    @IsString()
    @IsOptional()
    up_name:string;

    @IsString()
    @IsOptional()
    up_address:string;

    @IsString()
    @IsOptional()
    up_description:string | null;

    @IsString()
    @IsOptional()
    up_nit:string;

    @IsString()
    @IsOptional()
    up_phone:string;
}