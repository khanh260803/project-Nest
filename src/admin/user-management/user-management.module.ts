import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService, PrismaService, EmailService],
})
export class UserManagementModule {}
