import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';


import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-asset'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_RGPC_ASST ?? 'localhost:5008',
      package: [
        'pdequipt',
        'asset.regi_te.spd_tool_move',
        'asset.regi_te.spd_tool_repair',
        'pdequipt_inspect',
        'pdequipt_inspect_detail',
        'pd_multi_equipt'
      ],
      protoPath: [

        join(__dirname, '..', '..', 'proto', 'asset', 'pd_equipt.proto'),
        join(__dirname, '..', '..', 'proto', 'asset', 'regi_te', 'spd_tool_move.proto'),
        join(__dirname, '..', '..', 'proto', 'asset', 'regi_te', 'spd_tool_repair.proto'),
        join(__dirname, '..', '..', 'proto', 'asset', 'pd_equipt_inspect.proto'),
        join(__dirname, '..', '..', 'proto', 'asset', 'pd_equipt_inspect_detail.proto'),
        join(__dirname, '..', '..', 'proto', 'asset', 'pd_multi_equipt.proto'),

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

  await app.startAllMicroservices();
  logger.log(`🚀 REST API chạy trên ${process.env.HOST_PORT_ASSET}`);
  await app.listen(process.env.HOST_PORT_ASSET ?? 5008);
}

bootstrap();
