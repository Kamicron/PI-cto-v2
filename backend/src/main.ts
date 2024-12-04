import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Autorise uniquement le frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    credentials: true, // Si tu utilises des cookies ou des sessions
  });

  await app.listen(5000);
}
bootstrap();
