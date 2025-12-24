import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { appConfig } from './config/app.config';
import { join } from 'path';
import * as fs from 'fs';
import 'dotenv/config';

import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger.config';
import { Logger, } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const server = express();
  const logger = new Logger('Bootstrap');

  server.use(express.json({ limit: '1000mb' }));
  server.use(express.urlencoded({ limit: '1000mb', extended: true }));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_GRPC_UPLOAD ?? 'localhost:5006',

      package: ['upload.hr.hr_emp_info', 'upload.hr.contract_print', 'upload.upload.temp_file',],
      protoPath: [
        join(
          __dirname,
          '..',
          '..',
          'proto',
          'upload',
          'hr',
          'hr_emp_info.proto',
        ),

        join(
          __dirname,
          '..',
          '..',
          'proto',
          'upload',
          'hr',
          'contract_print.proto',
        ),
        join(__dirname, '..', '..', 'proto', 'upload', 'upload', 'temp_file.proto'),
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

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'http://localhost:8089'],
        },
      },
    })
  );

  app.enableCors(appConfig.corsOptions);
  app.setGlobalPrefix(appConfig.globalPrefix);
  server.use(express.static(join(__dirname, '..', 'public')));

  // Static file handlers (không đổi)
  const serveStatic = (pathGetter: () => string, urlPrefix: string) => {
    server.use(urlPrefix, (req, res, next) => {
      const filePath = join(pathGetter(), req.path);
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.status(404).sendFile(join(__dirname, '..', 'public', '404.html'));
          return;
        }
        next();
      });
    });
    server.use(urlPrefix, express.static(pathGetter()));
  };

  serveStatic(() => process.env.UPLOAD_PATHS, '/uploads');
  serveStatic(() => process.env.PATH_PRINT_PDF_DIR, '/c/invoice');
  serveStatic(() => '/var/www/uploads/pdf', '/pdf/invoice');
  serveStatic(() => process.env.PATH_PRINT_PDF_DIR, '/print/file');
  serveStatic(() => process.env.UPLOAD_USER_PATHS, '/public-files');
  serveStatic(() => process.env.ROOT_ASSET_PATH, '/viewer');

  await app.startAllMicroservices();
  await app.listen(appConfig.port);

  logger.log(`🚀 HTTP server listening on port ${appConfig.port}`);
  logger.log(`🔌 gRPC microservice connected at ${process.env.HOST_PORT_UPLOAD ?? '0.0.0.0:5000'}`);
}

bootstrap();
