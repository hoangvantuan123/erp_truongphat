import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV, sqlServerITMVCOMMON } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { AssetModule } from './modules/asset-mgn/modules/asset.module';
import { RegiTEModule } from './modules/regi-te/modules/regite.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...sqlServerITMV, name: 'ITMV' }),
    AssetModule,
    RegiTEModule

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
  ) { }

  async onModuleInit() {
    if (this.connection2.isConnected) {
      console.log('✅ ITMVJIG Database connected');
    } else {
      console.error('❌ Failed to connect to the ITMVJIG database');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
