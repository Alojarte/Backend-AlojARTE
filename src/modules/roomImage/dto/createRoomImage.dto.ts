import { IsNotEmpty, IsString } from "class-validator";
import { Room } from "src/modules/room/entity/room.entity";

export class RoomImage{

    @IsNotEmpty()
    room:Room;

    @IsNotEmpty()
    @IsString()
    image:string;


}