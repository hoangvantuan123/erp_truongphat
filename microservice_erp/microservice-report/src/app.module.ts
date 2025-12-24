import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV, sqlServerITMVCOMMON } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { ExecFinModule } from './modules/execFin/module/execFin.module';
import { CogsReportModule } from './modules/cogs/module/cogsReport.module';
import { InventoryReportModule } from './modules/inventory/module/inventory.module';
import { SalesReportModule } from './modules/sales/module/salesReport.module';
import { HrReportModule } from './modules/hr/module/hrReport.module';
import { AcctReportModule } from './modules/acct/module/acctReport.module';
import { PMModule } from './modules/project/module/pm.mondule';
import { PjtProjectModule } from './modules/pjtProject/module/pjtProject.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...sqlServerITMV, name: 'ITMV' }),
    TypeOrmModule.forRoot({
      ...sqlServerITMVCOMMON,
      name: 'ITMVCOMMON',
    }),
    ExecFinModule,
    CogsReportModule,
    InventoryReportModule,
    SalesReportModule,
    HrReportModule,
    AcctReportModule,
    PMModule,
    PjtProjectModule,
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
  constructor(
    @InjectConnection('ITMV') private readonly connection2: Connection,
    @InjectConnection('ITMVCOMMON')
    private readonly connectionCommon: Connection,
  ) { }

  async onModuleInit() {
    if (this.connection2.isConnected) {
      console.log('✅ ITMV Database connected');
    }
    if (this.connectionCommon.isConnected) {
      console.log('✅ ITMVCOMMON Database connected');
    } else {
      console.error('❌ Failed to connect to the ITMV database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
