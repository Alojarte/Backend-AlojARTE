import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const configService= app.get(ConfigService);
  const port= configService.get(SERVER_PORT)
  console.log(`servidor corriendo en el puerto ${port}`);
  await app.listen(port?? 3000);
}
bootstrap();
