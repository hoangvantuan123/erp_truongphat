import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { appConfig } from './config/app.config';
import { join } from 'path';
import * as fs from 'fs';
async function bootstrap() {
  const server = express();
  
  // Cấu hình giới hạn tải lên
  server.use(express.json({ limit: '1000mb' }));
  server.use(express.urlencoded({ limit: '1000mb', extended: true }));
  
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  // Cấu hình bảo mật
  app.use(helmet());  
  app.enableCors(appConfig.corsOptions);  
  app.setGlobalPrefix(appConfig.globalPrefix);  
  server.use(express.static(join(__dirname, '..', 'public')))

  await app.listen(appConfig.port); 
}

bootstrap();
