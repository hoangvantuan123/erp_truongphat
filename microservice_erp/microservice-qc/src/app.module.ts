import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthController } from './health.controller';
import { sqlServerITMV, sqlServerITMVCommon } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { IqcModule } from './modules/iqc/modules/iqc.module';
import { IqcPurchaseModule } from './modules/iqc-purchase/modules/iqc-purchase.module';
import { IqcOutsourceModule } from './modules/iqc-outsource/modules/iqc-outsource.module';
import { QaRegisterModule } from './modules/qa-register/modules/qa-register.module';
import { OqcModule } from './modules/oqc/modules/oqc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...sqlServerITMV,
      name: 'ITMV',
    }),
    TypeOrmModule.forRoot({
      ...sqlServerITMVCommon,
      name: 'ITMV_COMMON',
    }),
    IqcModule,
    IqcPurchaseModule,
    IqcOutsourceModule,
    QaRegisterModule,
    OqcModule
    
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
  controllers: [HealthController],
})


export class AppModule implements OnModuleInit {
  constructor(
    @InjectConnection('ITMV') private readonly connection2: Connection,
  ) { }

  async onModuleInit() {


    if (this.connection2.isConnected) {
      console.log('ITMV connected');
    }
    else {
      console.error('Failed to connect to the second database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
