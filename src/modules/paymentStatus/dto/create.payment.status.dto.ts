import { IsNotEmpty, IsString } from "class-validator";


export class CreatePaymentStatusDto{

    @IsNotEmpty({message:'El estado no puede estar vacio'})
    @IsString()
    status: string;

}