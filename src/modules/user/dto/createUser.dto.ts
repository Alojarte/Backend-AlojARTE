import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreatePeopleDto } from "src/modules/people/dto/createPeople.dto";


export class CreateUserDto{
    @IsOptional()
    cre_profilePhoto:Blob;

    @IsNotEmpty()
    @IsString()
    cre_email:string;

    @IsOptional()
    @IsNumber()
    cre_rol:number;

    @IsNotEmpty()
    @IsBoolean()
    cre_isVerified:boolean;

    @IsNotEmpty()
    @IsString()
    cre_codeVerify:string;

    @IsNotEmpty()
    @IsString()
    cre_password:string;

    @IsNotEmpty()
    people:CreatePeopleDto;

}