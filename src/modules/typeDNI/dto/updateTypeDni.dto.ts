import { IsNotEmpty, IsString } from "class-validator";
import { People } from "src/modules/people/entity/people.entity";

export class UpdateTypeDniDto{

    @IsString()
    @IsNotEmpty()
    typeDni:string;
}