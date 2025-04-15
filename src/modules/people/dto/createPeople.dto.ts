import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePeopleDto{
    @IsNotEmpty()
    @IsString()
    cre_name:string;

    @IsOptional()
    @IsString()
    cre_lastname:string;

    @IsNotEmpty()
    @IsDate()
    cre_birthdate:Date;

    @IsNotEmpty()
    @IsNumber()
    cre_typeDni:number;

    @IsNotEmpty()
    @IsString()
    cre_dni:string;       

    @IsOptional()
    @IsString()
    cre_phone:string;

    @IsOptional()
    @IsDate()
    cre_createdAt:Date;

}