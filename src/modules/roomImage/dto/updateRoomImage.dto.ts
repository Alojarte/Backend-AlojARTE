import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Room } from "src/modules/room/entity/room.entity";

export class RoomImage{

    @IsOptional()
    room:Room;

    @IsOptional()
    @IsString()
    image:string;


}