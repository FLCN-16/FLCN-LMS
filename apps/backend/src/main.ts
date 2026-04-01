import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable URI versioning (e.g., /api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global pipes and configuration
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
