import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './authentication/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './common/middlewares/verify.middleware';
import { CompanyManagementModule } from './admin/company-management/company-management.module';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { EmailModule } from './email/email.module';
import { TopicManagementModule } from './admin/topic-management/topic-management.module';
import { MinioModule } from './minio/minio.module';
import { UploadModule } from './upload/upload.module';
import { TopicManagementController } from './admin/topic-management/topic-management.controller';
import { TopicManagementService } from './admin/topic-management/topic-management.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/middlewares/roles.guard';
import { AuthController } from './authentication/auth.controller';
import { CompanyManagementController } from './admin/company-management/company-management.controller';
import { CompanyManagementService } from './admin/company-management/company-management.service';
import { RedisModule } from './redis/redis.module';
import { TagManagementModule } from './admin/tag-management/tag-management.module';
import { TagManagementController } from './admin/tag-management/tag-management.controller';
import { PostManagementModule } from './admin/post-management/post-management.module';
import { PostManagementController } from './admin/post-management/post-management.controller';
import { UserCompanyManagementModule } from './company_user/user-company-management/user-company-management.module';
import { UserCompanyManagementController } from './company_user/user-company-management/user-company-management.controller';
import { UserManagementController } from './admin/user-management/user-management.controller';
import { v4 as uuidv4 } from 'uuid';
import { CommentModule } from './comment/comment.module';
import { CommentController } from './comment/comment.controller';
import { LikeModule } from './like/like.module';
import { LikeController } from './like/like.controller';
import { UserController } from './user/user.controller';
import { CorrelationMiddleware } from './common/middlewares/correlation.middleware';

@Module({
  imports: [
    CacheModule.register({
      ttl: 100000,
      max: 100,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CompanyManagementModule,
    UserManagementModule,
    EmailModule,
    TopicManagementModule,
    MinioModule,
    UploadModule,
    RedisModule,
    TagManagementModule,
    PostManagementModule,
    UserCompanyManagementModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController, TopicManagementController],
  providers: [
    AppService,
    PrismaService,
    JwtService,
    TopicManagementService,
    CompanyManagementService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: 'user/userSetting', method: RequestMethod.POST },
        UserManagementController,
        TopicManagementController,
        CompanyManagementController,
        TagManagementController,
        PostManagementController,
        UserCompanyManagementController,
        CommentController,
        LikeController,
        UserController,
      )
      .apply(CorrelationMiddleware)
      .forRoutes('*');
  }
}
