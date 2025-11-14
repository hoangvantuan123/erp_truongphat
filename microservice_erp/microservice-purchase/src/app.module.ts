import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import * as cors from 'cors';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { sqlServerITMV } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { PurchaseModule } from './modules/purchase/module/purchase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...sqlServerITMV,
      name: 'ITMV',
    }),
    PurchaseModule,
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
  controllers: [],
})

export class AppModule implements OnModuleInit {
  constructor(
    @InjectConnection('ITMV') private readonly connection2: Connection,
  ) { }

  async onModuleInit() {
    if (this.connection2.isConnected) {
      console.log('✅ ITMV connected');
    } else {
      console.error('❌ Failed to connect to the second database');
    }

    // Kiểm tra bộ nhớ hiện tại
    this.logMemoryUsage();

    // Chạy kiểm tra bộ nhớ mỗi 10 giây
    setInterval(() => {
      this.logMemoryUsage();
    }, 10000);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }

  private logMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    const rssMB = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    const heapTotalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    const heapUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const externalMB = (memoryUsage.external / 1024 / 1024).toFixed(2);

/*     console.log(`🔹 Sử dụng bộ nhớ:
  - 📌 Bộ nhớ RAM (RSS): ${rssMB} MB
  - 📦 Tổng bộ nhớ Heap: ${heapTotalMB} MB
  - 🏗️ Bộ nhớ Heap đang dùng: ${heapUsedMB} MB
  - 🌐 Bộ nhớ ngoài Heap: ${externalMB} MB
`);
 */

    // 🔥 Cảnh báo nếu bộ nhớ Heap Used vượt quá 500MB
    const WARNING_THRESHOLD = 500; // MB
    if (parseFloat(heapUsedMB) > WARNING_THRESHOLD) {
      console.warn(`🚨 WARNING: Heap Used vượt quá ${WARNING_THRESHOLD}MB!`);

      // 🕵️‍♂️ Hiển thị danh sách các process đang chiếm bộ nhớ cao nhất
      console.log(`🔍 Checking active processes...`);
      const exec = require('child_process').exec;
      exec('wmic process get ProcessId,CommandLine,WorkingSetSize | sort /R | more', (error, stdout) => {
        if (!error) {
          console.log(`📌 Top memory processes:\n${stdout}`);
        } else {
          console.error(`❌ Error checking processes: ${error}`);
        }
      });
    }
  }

}
