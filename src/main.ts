import { NestFactory } from '@nestjs/core';
import { Transport, RedisOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.REDIS,
  //   options: {
  //     host: 'localhost',
  //     port: 6379,
  //   },
  // } as RedisOptions);
  // await app.listen();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error']
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();