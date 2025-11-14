
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import 'dotenv/config';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-auth'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.HOST_REDIS ?? 'redis-auth',
      port: Number(process.env.PORT_REDIS_AUTH),
      retryAttempts: 10,
      retryDelay: 3000,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_RGPC_AUTH ?? 'localhost:4004',
      package: [
        'public_ip',
        'email',
        'auth.user',
        'auth.roles.group_role'
      ],
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'auth', 'systemConfig', 'public_ip.proto'),
        join(__dirname, '..', '..', 'proto', 'auth', 'systemConfig', 'email.proto'),
        join(__dirname, '..', '..', 'proto', 'auth', 'user', 'user.proto'),
        join(__dirname, '..', '..', 'proto', 'auth', 'roles', 'group_role.proto'),
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
        'grpc.max_receive_message_length': 1024 * 1024 * 1024, // ✅ 200MB nhận
        'grpc.max_send_message_length': 1024 * 1024 * 1024, // ✅ 200MB gửi
        'grpc.http2.lookahead_bytes': 0,
        'grpc.enable_http_proxy': 0,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT_GRPC_AUTH ?? 4004);

}

bootstrap();
