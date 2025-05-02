import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomImage } from '../roomImage/entity/roomImage.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { Room } from '../room/entity/room.entity';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { FOLDER_ROOM } from 'src/config/constants';

@Injectable()
export class RoomimageService {
    constructor(
        @InjectRepository(RoomImage)
        private readonly roomImageRepository:Repository<RoomImage>,
        private readonly cloudinaryService:CloudinaryService,
        private readonly configService:ConfigService
    ){}

    async getAllImagesRooms():Promise<RoomImage[] | MessageDto>{
        try {
            const image= await this.roomImageRepository.find();
            if(image.length==0){
                throw new NotFoundException({
                    message:'no se encontraron imagenes de habitaciones en el sistema',
                    status:404
                });
            };
            return image;
        } catch (error) {
            return error;
        }
    }

    //obtener images por id de habitacion del hotel
    async getImageRoomById(id:number):Promise<RoomImage[] | MessageDto>{
        try {
            if(!id){
                throw new BadRequestException({
                    message:'el id de la habitacion no puede estar vacio',
                    status:400
                });
            };
            const room= new Room();
            room.id=id;
            const image= await this.roomImageRepository.findBy({room:room});
            if(image.length==0){
                throw new NotFoundException({
                    message:'no se encontraron imagenes de esta habitacion en el sistema',
                    status:404
                });
            };
            return image;
        } catch (error) {
            return error;
        }
    }
    
    async getImageById(id:number):Promise<RoomImage | MessageDto>{
        try {
            if(!id){
                throw new BadRequestException({
                    message:'el id de la imagen no puede estar vacio',
                    status:400
                });
            };
            const image=await this.roomImageRepository.findOneBy({id:id});
            if(!image){
                throw new NotFoundException({
                    message:'no se encontro la imagen en el sistema',
                    status:404
                });
            };
            return image;
        } catch (error) {
            return error;
        }
    }

    async createImageRoom(id:number,photo:Express.Multer.File):Promise<RoomImage | MessageDto>{
        try {
            if(!photo || !id){
                throw new BadRequestException({
                    message:'la imagen e id no puede estar vacio, revisa los campos',
                });
            };
            const folder=await this.configService.get<string>(FOLDER_ROOM);
            if(!folder){
                throw new BadRequestException({
                    message:'no se encontro la carpeta de almacenamiento del sistema',
                    status:400
                });
            };
            console.log('folder ',folder)
            const uploadImage=await this.cloudinaryService.uploadImageProfilePhoto(folder, photo);
            const url=uploadImage.secure_url;
            console.log('url : ',url);
            const room=new Room();
            room.id=id;
            const create=this.roomImageRepository.create({
                image:url,
                room:room
            })
            return await this.roomImageRepository.save(create);
        } catch (error) {
            return error;
        }
    }

    async deleteImageById(id:number):Promise<MessageDto>{
        try {
            if(!id){
                throw new BadRequestException({
                    message:' el id de la imagen no puede estar vacia',
                    status:400
                });
            };
            const image= await this.roomImageRepository.findOneBy({id:id});
            if(!image){
                throw new NotFoundException({
                    message:'no se encontro la imagen en el sistema',
                    status:404
                });
            };
            const folder=await this.configService.get<string>(FOLDER_ROOM);
            if(!folder){
                throw new BadRequestException({
                    message:'no se encontro la carpeta de almacenamiento del sistema',
                    status:400
                });
            };
            const imageId=image.image.split('/').pop()?.split('.')[0];
            if(!imageId){
                throw new BadRequestException({
                    message:'no se encontro el id de la imagen',
                    status:400
                });
            };
            await this.cloudinaryService.deleteImageProfilePhoto(folder, imageId);
            await this.roomImageRepository.delete(id);
            return new MessageDto('la imagen ha sido eliminada correctamente')
        } catch (error) {
            return error;
        }
    }
}
