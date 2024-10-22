import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostManagementDto } from './dto/create-post-management.dto';
import { UpdatePostManagementDto } from './dto/update-post-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Post, PrismaPromise } from '@prisma/client';

@Injectable()
export class PostManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async addPost(postDto: CreatePostManagementDto, req: CustomRequest) {
    const { title, content, topicID, tagID } = postDto;

    if (topicID == null) {
      throw new HttpException(
        { message: 'topicID not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (tagID == null) {
      throw new HttpException(
        { message: 'tagID not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.post.create({
      data: {
        topicId: topicID,
        tagId: tagID,
        createdBy: req.user?.id,
        pinned: false,
        title,
        content,
      },
    });
    return { message: 'post created' };
  }

  async editPost(
    id: number,
    postDto: CreatePostManagementDto,
    req: CustomRequest,
  ) {
    const { title, content, topicID, tagID } = postDto;

    if (topicID == null) {
      throw new HttpException(
        { message: 'topicID not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (tagID == null) {
      throw new HttpException(
        { message: 'tagID not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.post.update({
      data: {
        topicId: topicID,
        tagId: tagID,
        createdBy: req.user?.id,
        title,
        content,
      },
      where: { id },
    });
    return { message: 'post edited' };
  }

  async softDelete(id: number) {
    await this.prisma.post.update({
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      where: { id },
    });

    return { message: 'soft delete succesfull' };
  }

  async getAllCompany(): Promise<PrismaPromise<Post[]>> {
    return this.prisma.post.findMany({
      where: { isDeleted: false },
    });
  }

  async restorePost(id: number) {
    await this.prisma.post.update({
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      where: { id },
    });
    return { message: 'restore post successful' };
  }
}
