import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Stay Challenge API')
    .setDescription('A clean architecture implementation for financial operations')
    .setVersion('1.0')
    .addTag('Accounts', 'Account management operations')
    .addTag('Withdrawals', 'Withdrawal operations')
    .addTag('Webhooks', 'Webhook endpoints for external services')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const port = +configService.get('API_PORT');
  const host = configService.get('API_HOST');
  
  await app.listen(port, host);
  
  console.log(`🚀 Application is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
}
bootstrap();
