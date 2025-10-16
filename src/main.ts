import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module'
import { ConfigService } from './config/config.service';
import fastifyLogger from './config/logger/FastifyLoggerConfig';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: fastifyLogger,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(
    +configService.get('API_PORT'),
    configService.get('API_HOST'),
  );
}
bootstrap();
