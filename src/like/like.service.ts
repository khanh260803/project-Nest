import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Like } from '@prisma/client';
import { count } from 'console';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(commentId: number, req: CustomRequest) {
    try {
      const existingLike = await this.prisma.like.findUnique({
        where: { commentId_userId: { commentId, userId: req.user?.id } },
      });

      if (existingLike) {
        await this.prisma.like.delete({
          where: { commentId_userId: { commentId, userId: req.user?.id } },
        });
        return { message: 'unlike thanh cong' };
      } else {
        await this.prisma.like.create({
          data: { commentId, userId: req.user?.id },
        });
        return { message: 'like thanh cong' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getCountLike(
    commentId: number,
  ): Promise<{ data: number; message: string }> {
    try {
      const countLike = await this.prisma.like.count({ where: { commentId } });
      return { data: countLike, message: 'count like success' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
