import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { CreateMinioDto } from './dto/create-minio.dto';
import { UpdateMinioDto } from './dto/update-minio.dto';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}
}
