import { Injectable, BadRequestException } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';

@Injectable()
export class UploadService {
  constructor(private readonly minioService: MinioService) {}

  /**
   * Upload image to MinIO.
   */
  async uploadImage(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(mimetype)) {
      throw new BadRequestException('Invalid image format!');
    }
    return this.uploadToMinio('images-bucket', originalname, buffer, mimetype);
  }

  /**
   * Upload PDF or XLSX file to MinIO.
   */
  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!allowedMimes.includes(mimetype)) {
      throw new BadRequestException('Invalid file format!');
    }
    return this.uploadToMinio('files-bucket', originalname, buffer, mimetype);
  }

  private async uploadToMinio(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
  ) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      });
      await this.minioService.client.send(command);
      return { message: 'Upload successful!', filename: key };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload to MinIO.');
    }
  }
}
