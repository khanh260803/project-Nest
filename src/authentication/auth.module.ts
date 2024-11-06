import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtMiddleware } from './middlewares/verify.middleware';
import { TopicManagementController } from 'src/admin/topic-management/topic-management.controller';
import { TopicManagementService } from 'src/admin/topic-management/topic-management.service';
import { RedisModule } from 'src/redis/redis.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
    //
    JwtModule.register({
      secret: process.env.SECRET_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
    RedisModule,
  ],
  controllers: [AuthController, TopicManagementController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    TopicManagementService,
    EmailService,
  ],
})
export class AuthModule {}
