import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module'
import { ConfigService } from './config/config.service';
import { fastifyPinoLogger } from './config/logger/fastify-logger-config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      loggerInstance: fastifyPinoLogger,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(
    +configService.get('API_PORT'),
    configService.get('API_HOST'),
  );
}
bootstrap();
