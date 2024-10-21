import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtMiddleware } from './authentication/middlewares/verify.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({});
  // bat tinh nang validation toan cuc
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(3000);
}
bootstrap();
