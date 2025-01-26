import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation de la validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Configuration CORS
  app.enableCors({
    origin: [
      'https://pi-cto.top',
      'http://92.141.130.187',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  await app.listen(5000);
}
bootstrap();
