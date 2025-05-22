import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAvalaibleMethodDto{
    
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsOptional()
    description:string;
}