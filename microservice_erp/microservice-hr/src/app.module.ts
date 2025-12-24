import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV, sqlServerITMVCOMMON } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { HrInfo } from './modules/info/module/info.module';
import { OrgHrModule } from './modules/org-hr/modules/org-hr.module';
import { SearchStatisticModule } from './modules/search-statistic/modules/search-statistic.module';
import { AdmOrdModule } from './modules/hr-general/modules/adm-ord.module';
import { HrRecruitModule } from './modules/hr-recruit/modules/hrRecruit.module';
import { DefineModule } from './modules/define/modules/define.module';
import { DailyAttModule } from './modules/dailyAtt/module/dailyAtt.module';
import { HrEduModule } from './modules/edu/module/edu.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...sqlServerITMV, name: 'ITMV' }),
    TypeOrmModule.forRoot({
      ...sqlServerITMVCOMMON,
      name: 'ITMVCOMMON',
    }),
    HrInfo,
    OrgHrModule,
    SearchStatisticModule,
    AdmOrdModule,
    HrRecruitModule,
    DefineModule,
    DailyAttModule,
    HrEduModule,
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
