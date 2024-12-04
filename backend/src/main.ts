import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_URL, // Autorise uniquement le frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    credentials: true, // Si tu utilises des cookies ou des sessions
  });

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
