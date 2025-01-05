import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('WhereIsMyBuddy API')
    .setDescription('The WhereIsMyBuddy API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  // Add global pipes, filters, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Add the TransformInterceptor globally
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
