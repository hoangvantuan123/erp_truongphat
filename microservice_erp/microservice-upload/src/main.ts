import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import * as fs from 'fs';
import 'dotenv/config';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-upload'),
    ),
  });
  const logger = new Logger('Bootstrap');

  // 👇 Gắn microservice GRPC vào cổng riêng
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_GRPC_UPLOAD,
      package: [
        'upload.upload.group_temp',
        'upload.upload.temp_file',
        'upload.assets.asset_qr_tagging',
        'upload.upload.asset_group_file',
        'upload.item_print.item_print',
        'upload.item_print.item_print_qr_tagging',
        'upload.print.file_print'
      ],
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'upload', 'upload', 'group_temp.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'upload', 'temp_file.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'assets', 'asset_qr_tagging.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'upload', 'asset_group_file.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'item_print', 'item_print.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'item_print', 'item_print_qr_tagging.proto'),
        join(__dirname, '..', '..', 'proto', 'upload', 'print', 'file_print.proto'),
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
        'grpc.default_compression_algorithm': 2,
        'grpc.max_receive_message_length': 1024 * 1024 * 1024,
        'grpc.max_send_message_length': 1024 * 1024 * 1024,
        'grpc.http2.lookahead_bytes': 0,
        'grpc.enable_http_proxy': 0,
      },
    },
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'http://localhost:5106', 'http://localhost:3030', 'https://hpm.ierps.vn', 
            'https://truongphat.ierps.vn'
          ],
        },
      },
    })
  );

  app.enableCors({
    origin: [
      '*',
      'http://localhost:3030',
      'https://hpm.ierps.vn',
      'https://ierps.vn',
      'https://truongphat.ierps.vn'
    ],
    methods: 'GET,POST,PUT,DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
  });
  app.use(express.static(join(__dirname, '..', 'public')));


  const serveStatic = (pathGetter: () => string, urlPrefix: string) => {
    app.use(urlPrefix, (req, res, next) => {
      const filePath = join(pathGetter(), req.path);

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.status(404).sendFile(join(__dirname, '..', 'public', '404.html'));
          return;
        }
        next();
      });
    });
    app.use(urlPrefix, express.static(pathGetter()));
  };
  serveStatic(() => process.env.UPLOAD_PATHS, '/uploads');
  serveStatic(() => process.env.ROOT_ASSET_PATH, '/viewer');
  serveStatic(() => process.env.PATH_PRINT_PDF_DIR, '/print/file');
  await app.startAllMicroservices();

  const httpPort = Number(process.env.HOST_PORT_UPLOAD);
  await app.listen(httpPort);

  logger.log(`🚀 REST API chạy trên http://localhost:${httpPort}`);
  logger.log(`🚀 gRPC Microservice chạy trên ${process.env.HOST_GRPC_UPLOAD ?? 'localhost:5059'}`);
}

bootstrap();