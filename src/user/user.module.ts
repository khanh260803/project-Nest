import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { MinioModule } from 'src/minio/minio.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [MinioModule, UploadModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
