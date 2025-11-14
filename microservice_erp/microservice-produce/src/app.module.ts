import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { BomModule } from './modules/BOM/modules/bom.modules';
import { DefineModule } from './modules/define/modules/define.module';
import { ProductModule } from './modules/product/modules/product.module';
import { PdmpsProd } from './modules/pdmpsProd/modules/pdmpsProd.modules';
import { WorkCenterModule } from './modules/workCenter/modules/workCenter.module';
import { PdmmModule } from './modules/pdmm/modules/pdmm.module';
import { Pdsfc } from './modules/pdsfc/modules/pdsfc.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...sqlServerITMV, name: 'ITMV' }),
    BomModule,
    DefineModule,
    ProductModule,
    PdmpsProd,
    WorkCenterModule,
    PdmmModule, 
    Pdsfc
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection('ITMV') private readonly connection2: Connection) { }

  async onModuleInit() {
    if (this.connection2.isConnected) {
      console.log('✅ ITMV Database connected');
    } else {
      console.error('❌ Failed to connect to the ITMV database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
