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
      createWinstonLoggerOptions('microservice-report'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_GRPC_REPORT,
      package: [
        'report.exec_fin.fin_query_cmp',
        'report.cogs.cogs_report',
        'report.inventory.supplement_issue',
        'report.sales.sales_report',
        'report.hr.hr_report',
        'report.acct.acct_report',
      ],
      protoPath: [

        join(__dirname, '..', '..', 'proto', 'report', 'exec_fin', 'fin_query_cmp.proto'),
        join(__dirname, '..', '..', 'proto', 'report', 'cogs', 'cogs_report.proto'),
        join(__dirname, '..', '..', 'proto', 'report', 'inventory', 'supplement_issue.proto'),
        join(__dirname, '..', '..', 'proto', 'report', 'sales', 'sales_report.proto'),
        join(__dirname, '..', '..', 'proto', 'report', 'hr', 'hr_report.proto'),
        join(__dirname, '..', '..', 'proto', 'report', 'acct', 'acct_report.proto'),

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
  logger.log(`🚀 REST API chạy trên ${process.env.HOST_GRPC_REPORT}`);
  await app.listen(process.env.HOST_PORT_REPORT ?? 5007);
}

bootstrap();
