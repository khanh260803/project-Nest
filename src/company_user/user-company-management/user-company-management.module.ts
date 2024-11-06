import { Module } from '@nestjs/common';
import { UserCompanyManagementService } from './user-company-management.service';
import { UserCompanyManagementController } from './user-company-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [UserCompanyManagementController],
  providers: [UserCompanyManagementService, PrismaService, EmailService],
})
export class UserCompanyManagementModule {}
