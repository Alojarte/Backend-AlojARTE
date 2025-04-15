
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Rol } from "src/modules/rol/entity/rol.entity";


export class ActUserDto{

    @IsNotEmpty()
    act_Id:number;

    @IsNotEmpty()
    @IsNumber()
    act_people:number;

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

}