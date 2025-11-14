import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-sp'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_RGPC_SP ?? 'localhost:4003',
      package: ['codehelp', 'sp.basic.help_define', 'sp.emp_help'],
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'sp', 'codehelp.proto'),
        join(__dirname, '..', '..', 'proto', 'sp', 'help_define.proto'),
        join(__dirname, '..', '..', 'proto', 'sp', 'emp_help.proto'),
      ],
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
      channelOptions: {
        'grpc.default_compression_algorithm': 2, // Gzip
        'grpc.max_receive_message_length': 1024 * 1024 * 1024, // ✅ 200MB nhận
        'grpc.max_send_message_length': 1024 * 1024 * 1024, // ✅ 200MB gửi
        'grpc.http2.lookahead_bytes': 0, // ⚡ Tăng tốc streaming
        'grpc.enable_http_proxy': 0, // 🔒 Tránh bị proxy chặn
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT_GRPC_SP ?? 4003);

  console.log('🚀 REST API chạy trên http://localhost:4003');
  console.log('🚀 gRPC Microservice chạy trên localhost:4003');
}

bootstrap();
