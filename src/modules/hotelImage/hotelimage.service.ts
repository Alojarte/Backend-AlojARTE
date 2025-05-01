import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelImage } from './entity/hotelImage.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { HotelService } from '../hotel/hotel.service';
import { ConfigService } from '@nestjs/config';
import { FOLDER_HOTEL } from 'src/config/constants';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Hotel } from '../hotel/entity/hotel.entity';

@Injectable()
export class HotelimageService {
    constructor(
        @InjectRepository(HotelImage)
        private readonly hotelImageRepository: Repository<HotelImage>,

        private readonly hotelService: HotelService,
        private readonly configservice:ConfigService,
        private readonly cloudinarService:CloudinaryService
    ){}

    async getAllHotelImages():Promise<HotelImage[] | MessageDto>{
        try {
            const res=await this.hotelImageRepository.find();
            if(res.length>0){
                return res;
            }
            return new MessageDto('no se encontraron imagenes de hoteles en el servidor')
            
        } catch (error) {
            return error.response
        }
    }

    //imagen por id de hotel
    async getHotelImageById(id:number):Promise<any>{
        try {
            const existhotel= await this.hotelService.getHotelById(id);
            if(!existhotel){
                throw new NotFoundException('no se encontro el hotel')
            }
            const res= await this.hotelImageRepository.find({
                where:{
                    Hotel:{
                        id:id
                    }
                }
            });

            if(res.length>0){
                return res;
            }
            return new MessageDto('no se econtraron imagenes para este hotel')
        } catch (error) {
            return error.response
        }
    }

    async getImageById(id:number){
        try {
            const folder=await this.configservice.get<string>(FOLDER_HOTEL)
            if(!folder){
                throw new BadRequestException('no se encontro la carpeta para subir las imagenes del hotel en su sitema ');
            }

            const existsImage=await this.hotelImageRepository.findOne({
                where:{
                    id:id
                }
            });

            if(!existsImage){
                throw new NotFoundException('la imagen no se encuentra en la base de datos')
            }

            return existsImage;
        } catch (error) {
            throw new BadRequestException(error.response);
        }

    }

    async uploadImageFromHotel(id:number, photo:Express.Multer.File):Promise<any>{
        try {
            console.log('agregando imagen para hotel con id : '+id)
            const folder=this.configservice.get<string>(FOLDER_HOTEL)
            if(!folder){
                throw new BadRequestException('no se encontro la carpeta para subir las imagenes del hotel en su sitema ')
            }

            const existshotel=await this.hotelService.getHotelById(id);
            if(!existshotel){
                throw new NotFoundException('el hotel no existe porfavor verifica los datos')
            }

            const uploadResult= await this.cloudinarService.uploadImageProfilePhoto(folder, photo);
            const secureUrl=uploadResult.secure_url;
            const hotel=new Hotel;
            hotel.id=id;
            const image=this.hotelImageRepository.create({
                Hotel:hotel,
                image:secureUrl
            })
            const save=this.hotelImageRepository.save(image);

            return {
                message:'imagen agregada correctamente',
                image:save
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la foto de perfil: ' + error.message);
        }
    }

    async deleteImageById(id:number):Promise<any>{
        try {
            console.log('eliminando imagen con id : '+id)
            const folder=this.configservice.get<string>(FOLDER_HOTEL);
            if(!folder){
                throw new BadRequestException('no se encontro la carpeta de almacenamiento del sistema')
            }
            const existsImage= await this.hotelImageRepository.findOne({
                where:{id:id}
            });
            if(!existsImage){
                throw new NotFoundException('la imagen no existe en la base de datos');
            };

            const publicId=existsImage.image.split('/').pop()?.split('.')[0]
            console.log('eliminando imagen con publicId : '+publicId);
            if(!publicId){
                throw new BadRequestException('no se ha encontrado el publicId de la imagen porfavor intentelo nuevamente')
            }
            await this.cloudinarService.deleteImageProfilePhoto(folder,publicId);
            await this.hotelImageRepository.delete(id);
            return {
                message:'imagen eliminada exitosamente'
            }

        } catch (error) {
            return error.response
        }
    }


}
