import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.HOST_REDIS ?? 'localhost',
        port:  Number(process.env.PORT_REDIS_PURCHASEN),
        retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
        retryDelay: 5000, // Đợi 5 giây trước khi thử lại
        reconnectOnError: (err: Error) => {
          console.error('🔄 Redis reconnecting due to error:', err.message);
          return true;
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
