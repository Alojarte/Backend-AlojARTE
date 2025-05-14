import { IsNumber, IsOptional, IsString } from "class-validator";

export class FilterRoomDto{

    @IsOptional()
    @IsNumber()
    f_typeRoomId:number;

    @IsOptional()
    @IsString()
    f_number:string;

    @IsOptional()
    @IsNumber()
    f_hotel:number;

    @IsOptional()
    @IsNumber()
    f_priceMAx:number;

    @IsOptional()
    @IsNumber()
    f_priceMin:number;

    @IsOptional()
    @IsString()
    f_priceOrder:string;

    @IsOptional()
    @IsNumber()
    f_capacityMax:number;

    @IsOptional()
    @IsNumber()
    f_capacityMin:number;

    @IsOptional()
    @IsNumber()
    f_status:number;
}