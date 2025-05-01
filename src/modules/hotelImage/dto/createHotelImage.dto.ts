import { IsNotEmpty, IsString } from "class-validator";
import { Hotel } from "src/modules/hotel/entity/hotel.entity";

export class CreateHotelImage{
    @IsNotEmpty()
    Hotel:Hotel;

    @IsString()
    image:string;
}