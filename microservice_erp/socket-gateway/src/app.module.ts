import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { SocketModule } from './socket/socket.module';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_AUTH ?? 'redis-auth',
          port: Number(process.env.PORT_REDIS_AUTH),
          retryAttempts: 10,
          retryDelay: 5000,
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },
    ]),
    SocketModule
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule { }
