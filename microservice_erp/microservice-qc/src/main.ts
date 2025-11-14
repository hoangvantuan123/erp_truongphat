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
        port:  Number(process.env.PORT_REDIS_QC),
        retryAttempts: 10,
        retryDelay: 3000,
      },

    },
  );
  await app.listen();
}
bootstrap();
