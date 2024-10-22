import { Module } from '@nestjs/common';
import { TagManagementService } from './tag-management.service';
import { TagManagementController } from './tag-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TagManagementController],
  providers: [TagManagementService, PrismaService],
})
export class TagManagementModule {}
