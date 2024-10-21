import { Module } from '@nestjs/common';
import { TopicManagementService } from './topic-management.service';
import { TopicManagementController } from './topic-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TopicManagementController],
  providers: [TopicManagementService, PrismaService],
})
export class TopicManagementModule {}
