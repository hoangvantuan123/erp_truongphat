import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV, sqlServerITMV230427 } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { CodeHelpComboQueryModule } from './modules/codeHelp/module/codeHelpComboQuery.module';
import { DefineHelp } from './modules/define/define.module';
import { EmpHelpModule } from './modules/empSp/module/emp.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...sqlServerITMV, name: 'ITMV',}),
    TypeOrmModule.forRoot({ ...sqlServerITMV230427, name: 'ITMV230427',}),
    CodeHelpComboQueryModule,
    DefineHelp,
    EmpHelpModule
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
    @InjectConnection('ITMV230427') private readonly connection3: Connection,

) { }

  async onModuleInit() {
    if (this.connection2.isConnected) {
      console.log('✅ ITMV Database connected');
    } 
    if(this.connection3.isConnected) {
      console.log('✅ ITMV230427 Database connected');
    }
    else {
      console.error('❌ Failed to connect to the ITMV database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
