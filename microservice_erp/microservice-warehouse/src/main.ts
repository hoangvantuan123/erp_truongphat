import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';
import { join } from 'path';
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // 1️⃣ Tạo app HTTP REST (nếu cần)
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-warehouse'),
    ),
  });

  // 2️⃣ Kết nối gRPC Microservice
  const grpcHost = process.env.HOST_RGPC_WH ?? '0.0.0.0:5009';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: grpcHost,
      package: [
        'wh.cust.sda_cust',


      ], // điền package gRPC
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'wh', 'cust', 'sda_cust.proto'),

      ], // điền proto path
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

  // 3️⃣ Kết nối Redis Microservice (nếu cần)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.HOST_REDIS ?? 'localhost',
      port: Number(process.env.PORT_REDIS_WAREHOUSE ?? 6379),
      retryAttempts: 10,
      retryDelay: 5000,
      reconnectOnError: (err: Error) => {
        logger.error('🔄 Redis reconnecting due to error: ' + err.message);
        return true;
      },
    },
  });

  // 4️⃣ Khởi chạy tất cả microservices
  await app.startAllMicroservices();
  logger.log(`🚀 gRPC microservice chạy trên ${grpcHost}`);

  // 5️⃣ Khởi chạy HTTP REST API (nếu cần)
  const restPort = Number(process.env.HOST_PORT_WH ?? 5099);
  await app.listen(restPort);
  logger.log(`🚀 REST API chạy trên port ${restPort}`);
}

bootstrap();
