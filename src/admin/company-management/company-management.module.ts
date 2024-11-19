import { Module, LoggerService } from '@nestjs/common';
import { CompanyManagementService } from './company-management.service';
import { CompanyManagementController } from './company-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CompanyManagementController],
  providers: [CompanyManagementService, PrismaService],
})
export class CompanyManagementModule {}
