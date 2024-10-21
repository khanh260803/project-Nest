import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioService } from 'src/minio/minio.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu file tạm thời
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname)); // Đặt tên file duy nhất
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, MinioService],
})
export class UploadModule {}
