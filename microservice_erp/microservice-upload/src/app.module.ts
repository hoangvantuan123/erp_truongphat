import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthController } from './health.controller';
import { sqlServerITMV } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { UploadModule } from './modules/upload/modules/upload.module';
import { InvoiceModule } from './modules/invoice/modules/invoice.module';
import { PrintModule } from './modules/print/modules/print.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HrUploadInfo } from './modules/hr/module/hrUpload.module';
import { join } from 'path';
import { SecureFilePublicController } from './modules/static-file/file-public';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...sqlServerITMV,
      name: 'ITMV',
    }),

    UploadModule, InvoiceModule,
    PrintModule,
    HrUploadInfo
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
  controllers: [HealthController, SecureFilePublicController],
})


export class AppModule implements OnModuleInit {
  constructor(
    @InjectConnection('ITMV') private readonly connection2: Connection,
  ) { }

  async onModuleInit() {


    if (this.connection2.isConnected) {
      console.log('ITMV connected');
    } else {
      console.error('Failed to connect to the second database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
