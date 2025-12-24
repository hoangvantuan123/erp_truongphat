import {
  Module,
  MiddlewareConsumer,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, InjectConnection } from '@nestjs/typeorm';
import { SocketModule } from './socket/socket.module';
import { sqlServerITMV } from './config/database.config';
import { Connection } from 'typeorm';
import * as cors from 'cors';
import { JobNotifiModule } from './modules/notification/module/notification.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      ...sqlServerITMV,
      name: 'ITMV',
    }),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_AUTH || 'redis-auth',
          port: Number(process.env.PORT_REDIS_AUTH) || 6379,
          retryAttempts: 10,
          retryDelay: 5000,
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting:', err.message);
            return true;
          },
        },
      },
    ]),

    SocketModule,
    JobNotifiModule
  ],
})
export class AppModule
  implements OnModuleInit, NestModule {
  constructor(
    @InjectConnection('ITMV')
    private readonly itmvConnection: Connection,
  ) { }

  async onModuleInit() {
    if (this.itmvConnection.isConnected) {
      console.log('✅ ITMV Database connected');
    } else {
      console.error('❌ ITMV Database connection failed');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
