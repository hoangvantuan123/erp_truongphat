import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthController } from './health.controller';
import { APP_FILTER } from '@nestjs/core';
import { QRModule } from './modules/qr/modules/qr.module';
import { BarcodeModule } from './modules/barcode/modules/barcode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QRModule,
    BarcodeModule
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
  controllers: [HealthController],
})


export class AppModule implements OnModuleInit {
  constructor(
  ) { }

  async onModuleInit() {



  }
}
