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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_GRPC_SOCKET,
      package: [
        'socket.notification.notification',

      ],
      protoPath: [

        join(__dirname, '..', '..', 'proto', 'socket', 'notification', 'notification.proto'),

      ],
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
      channelOptions: {
        'grpc.max_concurrent_streams': 100,
        'grpc.default_compression_algorithm': 2, // Gzip
        'grpc.max_receive_message_length': 1024 * 1024 * 1024, // ✅ 200MB nhận
        'grpc.max_send_message_length': 1024 * 1024 * 1024, // ✅ 200MB gửi
        'grpc.http2.lookahead_bytes': 0, // ⚡ Tăng tốc streaming
        'grpc.enable_http_proxy': 0, // 🔒 Tránh bị proxy chặn
      },
    },
  });
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
