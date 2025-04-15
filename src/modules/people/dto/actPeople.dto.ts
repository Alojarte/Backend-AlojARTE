import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ActPeopleDto{
    @IsOptional()
    @IsString()
    act_name:string;

    @IsOptional()
    @IsString()
    act_lastname:string;

    @IsOptional()
    @IsDate()
    act_birthdate:Date;

    @IsOptional()
    @IsNumber()
    act_typeDni:number;

    @IsOptional()
    @IsOptional()
    act_dni:string;       

    @IsOptional()
    @IsString()
    act_phone:string;

}