
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ActPeopleDto } from "src/modules/people/dto/actPeople.dto";
import { Rol } from "src/modules/rol/entity/rol.entity";


export class ActUserDto{

    @IsOptional()
    act_Id:number;

    @IsNotEmpty()
    @IsNumber()
    act_people:ActPeopleDto;

    @IsOptional()
    ac_profilePhoto:string;

    @IsOptional()
    @IsString()
    act_email:string;

    @IsOptional()
    act_rol:Rol;

    @IsOptional()
    @IsBoolean()
    act_isVerified:boolean;

    @IsOptional()
    @IsString()
    act_codeVerify:string;

    @IsOptional()
    @IsString()
    act_password:string;

    @IsOptional()
    act_expiredMin:string | null;

    @IsOptional()
    act_dateSend:Date | null;

    @IsOptional()
    act_token:string | null;

}