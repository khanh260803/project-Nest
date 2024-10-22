import { Module } from '@nestjs/common';
import { PostManagementService } from './post-management.service';
import { PostManagementController } from './post-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PostManagementController],
  providers: [PostManagementService, PrismaService],
})
export class PostManagementModule {}
