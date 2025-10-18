import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

import { AppModule } from './app.module'
import { ConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './ports/api/common/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration from YAML file
  const yamlFile = readFileSync(join(__dirname, '../openapi.yml'), 'utf8');
  const document = parse(yamlFile);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Server configuration
  const configService = app.get(ConfigService);
  const port = +configService.get('API_PORT');
  const host = configService.get('API_HOST');
  
  // Run the application
  await app.listen(port, host);
  
  console.log(`🚀 Application is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
}
bootstrap();
