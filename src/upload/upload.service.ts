import { Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
@Injectable()
export class UploadService {
  constructor(private readonly MiniClientService: MinioService) {}

  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, path } = file;

    const command = new PutObjectCommand({
      Bucket: 'uploads',
      Key: originalname,
      Body: createReadStream(path),
      ContentType: mimetype,
    });
    await this.MiniClientService.client.send(command);
  }
}
