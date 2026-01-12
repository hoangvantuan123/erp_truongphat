import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerERP } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { UploadModule } from './modules/upload/modules/upload.module';
import { PrintModule } from './modules/print/modules/print.module';
import { SecureFileController } from './modules/static-file/secure-file.controller';
import { SecureFilePdfController } from './modules/static-file/secure-file-pdf.controller';
import { SecureQRTaggFileController } from './modules/static-file/secure-qr-tagg-file.controller';
import { SecureFileAssetController } from './modules/static-file/secure-file-asset.controller';
import { HrUploadInfo } from './modules/hr/module/hrUpload.module';
import { ItemPrintModule } from './modules/item-print/module/itemPrint.module';
import { SecureFileItemController } from './modules/static-file/secure-file-item.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...sqlServerERP,
      name: 'ERP',
    }),
    UploadModule,
    PrintModule,
    HrUploadInfo,
    ItemPrintModule
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
  controllers: [
    SecureFileController,
    SecureFilePdfController,
    SecureQRTaggFileController,
    SecureFileAssetController,
    SecureFileItemController
  ],
})


export class AppModule implements OnModuleInit {
  constructor(
    @InjectConnection('ERP') private readonly connection2: Connection,
  ) { }

  async onModuleInit() {


    if (this.connection2.isConnected) {
      console.log('ERP connected');
    } else {
      console.error('Failed to connect to the second database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
