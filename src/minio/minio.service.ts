// src/minio-client/minio-client.service.ts
import { Injectable } from '@nestjs/common';
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class MinioService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: 'http://localhost:9000',
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'admin',
        secretAccessKey: 'password123',
      },
      forcePathStyle: true,
    });
  }

  get client() {
    return this.s3Client;
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket ${bucketName} created or already exists.`);
    } catch (error) {
      if (error.Code !== 'BucketAlreadyOwnedByYou') {
        console.error(`Error creating bucket ${bucketName}:`, error);
        throw error;
      }
    }
  }
}
