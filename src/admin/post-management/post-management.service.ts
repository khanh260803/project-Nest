import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostManagementDto } from './dto/create-post-management.dto';
import { UpdatePostManagementDto } from './dto/update-post-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Post, PrismaPromise } from '@prisma/client';

@Injectable()
export class PostManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async addPost(
    postDto: CreatePostManagementDto,
    req: CustomRequest,
  ): Promise<{ data: Post; message: string }> {
    try {
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
      const result = await this.prisma.post.create({
        data: {
          topicId: topicID,
          tagId: tagID,
          createdBy: req.user?.id,
          pinned: false,
          title,
          content,
        },
      });
      return {
        message: 'Post created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editPost(
    id: number,
    postDto: CreatePostManagementDto,
    req: CustomRequest,
  ): Promise<{ data: Post; message: string }> {
    try {
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

      const result = await this.prisma.post.update({
        data: {
          topicId: topicID,
          tagId: tagID,
          createdBy: req.user?.id,
          title,
          content,
        },
        where: { id },
      });
      return {
        message: 'Post updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(
    id: number,
  ): Promise<{ success: boolean; data: Post; message: string }> {
    try {
      const result = await this.prisma.post.update({
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
        where: { id },
      });

      return {
        success: true,
        message: 'Post updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCompany(): Promise<PrismaPromise<Post[]>> {
    try {
      return this.prisma.post.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async restorePost(id: number): Promise<{ data: Post; message: string }> {
    try {
      const result = await this.prisma.post.update({
        data: {
          isDeleted: false,
          deletedAt: null,
        },
        where: { id },
      });
      return { data: result, message: 'restore post successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async pinPost(id: number): Promise<{ data: Post; message: string }> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });
      if (post.pinned !== true) {
        const result = await this.prisma.post.update({
          data: { pinned: true },
          where: { id },
        });
        return { data: result, message: 'pin post successful' };
      } else {
        const result = await this.prisma.post.update({
          data: { pinned: false },
          where: { id },
        });
        return { data: result, message: 'unpin post successful' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getLastestPost(): Promise<{ data: Post[]; message: string }> {
    try {
      const lastestPost = await this.prisma.post.findMany({
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      });

      return { data: lastestPost, message: 'fetch 5 post successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
