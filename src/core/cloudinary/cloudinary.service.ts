import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { FOLDER_PROFILE } from 'src/config/constants';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class CloudinaryService {
    constructor(
        private readonly configService:ConfigService
    ){}

    async uploadImageProfilePhoto(folder:string, file:Express.Multer.File):Promise<UploadApiResponse | UploadApiErrorResponse>{
        console.log('subiendo imagen a la carpeta :'+folder)
        return new Promise((resolve,reject)=>{
            const upload=cloudinary.uploader.upload_stream(
                {folder:folder},
                (error,result)=>{
                    if(error) return reject(error);
                    resolve(result!);
                }
            );
            const readableStream= Readable.from(file.buffer);
            readableStream.pipe(upload);
        })
    }

    async deleteImageProfilePhoto(folder:string,publicId:string):Promise<any>{
        const publicIda=folder+'/'+publicId;
        console.log('eliminando imagen con publicId :'+publicId)
        console.log('publicIdReal :'+publicIda)
        const response= await cloudinary.uploader.destroy(publicIda).then((error)=>{
            console.log('respuesta')
            console.log(error);
        })
    }

}
