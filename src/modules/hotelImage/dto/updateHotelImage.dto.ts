import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Hotel } from "src/modules/hotel/entity/hotel.entity";

export class CreateHotelImage{
    @IsOptional()
    Hotel:Hotel;

    @IsString()
    @IsString()
    image:string;
}