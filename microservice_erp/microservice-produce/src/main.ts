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
      createWinstonLoggerOptions('microservice-produce'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.HOST_REDIS ?? 'localhost',
      port: Number(process.env.PORT_REDIS_PRODUCTION),
      retryAttempts: 10,
      retryDelay: 3000,
    },
  });

  // Kết nối microservice gRPC
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_RGPC_PDMM ?? 'localhost:4002',
      package: [
        'metadata',
        'produce_wcq',
        'scom_cofirm',
        'spdmm.out_req_cancel',
        'spdmm.out_req_item_stock_query',
        'spdmm.out_req_list_query',
        'spdmm.out_req',
        'spdmm.out_req_item_list_query',
        'scan.pdmm_out_proc',
        'pdmm.pdms_prod_plan',
        'pdmm.pdsfc_list',
        'pdmm.pdsfc_work_report',
        'produce.bom.bom',

      ],
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'metadata.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'wc', 'work_center_q.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'scom_confirm.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_cancel.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_item_stock_query.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_list_query.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_item_list_query.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'scan_pdmm_out_proc.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'pdms_prod_plan.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'pdsfc_list.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'pdmm', 'pdsfc_work_report.proto'),
        join(__dirname, '..', '..', 'proto', 'produce', 'bom', 'bom.proto'),
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
  await app.listen(process.env.PORT_GRPC_PRODUCE ?? 4002);

  console.log('🚀 REST API chạy trên http://localhost:4002');
  console.log('🚀 gRPC Microservice chạy trên localhost:4002');
}

bootstrap();
