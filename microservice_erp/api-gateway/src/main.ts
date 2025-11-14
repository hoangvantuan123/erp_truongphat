import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';
import { appConfig } from './config/app.config';
import * as bodyParser from 'body-parser';
import { join } from 'path';

import 'dotenv/config';
async function bootstrap() {
  const server = express();

  server.use(express.json({ limit: '1gb' }));
  server.use(express.urlencoded({ extended: true, limit: '1gb' }));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // ✅ Middleware log toàn bộ request gửi đến API Gateway
  server.use((req, res, next) => {
    const start = Date.now();
    console.log(`📤 [REQUEST] ${req.method} ${req.originalUrl} - Body:`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`✅ [RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ⏱ ${duration}ms`);
    });

    next();
  });

  await app.startAllMicroservices();

  app.use(helmet());
  app.enableCors(appConfig.corsOptions);
  app.setGlobalPrefix(appConfig.globalPrefix);

  await app.listen(appConfig.port);
  console.log(`🚀 API SERVER:${appConfig.port}`);
}


bootstrap();
