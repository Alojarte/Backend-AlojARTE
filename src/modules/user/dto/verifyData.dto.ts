import { IsOptional } from "class-validator";

export class VerifyDto{
    @IsOptional()
    act_expiredMin:string | null;

    @IsOptional()
    act_token:string | null;

    @IsOptional()
    act_dateSend:Date | null;

    @IsOptional()
    act_verificationCode:string;
}