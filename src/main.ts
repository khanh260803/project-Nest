import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtMiddleware } from './common/middlewares/verify.middleware';
import { ResponseInterceptor } from './common/response.interceptor';
import { InterceptorsFilter } from './common/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new InterceptorsFilter());
  await app.listen(3001);
}
bootstrap();
