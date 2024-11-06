import { Module, LoggerService } from '@nestjs/common';
import { CompanyManagementService } from './company-management.service';
import { CompanyManagementController } from './company-management.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpExceptionFilter } from 'src/authentication/middlewares/http-exception.filter';
import { LoggerModule } from 'src/winston/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [CompanyManagementController],
  exports: [HttpExceptionFilter],
  providers: [CompanyManagementService, PrismaService, HttpExceptionFilter],
})
export class CompanyManagementModule {}
