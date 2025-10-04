import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable trust proxy to handle X-Forwarded-For headers
  app.getHttpAdapter().getInstance().enable('trust proxy');
  // set prefix for every endpoint to api/v1
  app.setGlobalPrefix("api/v1", { exclude: [""] })
  // whitelist configured fields and throw error for non whitelisted fields
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  // cors configurations
  app.enableCors({
    origin: ['https://futurelifeecom.io.vn'],
    // origin: '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
  })
  await app.listen(4000);
}
bootstrap();