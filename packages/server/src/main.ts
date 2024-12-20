import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
