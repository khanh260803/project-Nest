import { Module, DynamicModule, Global } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { MinioService } from './minio.service';

@Global()
@Module({
  providers: [MinioService],
  exports: [MinioService], // Export service nếu cần
})
export class MinioModule {}
