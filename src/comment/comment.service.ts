import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Comment } from '@prisma/client';
import { error } from 'console';
@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(
    commentDto: CreateCommentDto,
    id: number,
    req: CustomRequest,
  ): Promise<{ data: Comment; message: string }> {
    try {
      const { comment } = commentDto;
      const result = await this.prisma.comment.create({
        data: {
          postId: id,
          content: comment,
          createdBy: req.user?.id,
          resolved: false,
        },
      });
      return { data: result, message: 'add comment successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async editComment(
    commentDto: CreateCommentDto,
    id: number,
    req: CustomRequest,
  ): Promise<{ data: Comment; message: string }> {
    try {
      //kiem tra xem no thuoc bai post nao
      const idComment = await this.prisma.comment.findUnique({ where: { id } });
      if (req.user?.id !== idComment.createdBy) {
        throw new HttpException(
          { message: 'Can access' },
          HttpStatus.FORBIDDEN,
        );
      }
      const { comment } = commentDto;
      const result = await this.prisma.comment.update({
        data: {
          postId: idComment.postId,
          content: comment,
          createdBy: idComment.createdBy,
          resolved: false,
        },

        where: {
          id,
        },
      });
      return { data: result, message: 'add comment successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getComment(id: number): Promise<{ data: Comment[] }> {
    try {
      const result = await this.prisma.comment.findMany({
        where: { postId: id, isDeleted: false },
      });
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async softDelete(
    id: number,
    req: CustomRequest,
  ): Promise<{ data: Comment; message: string }> {
    try {
      const idComment = await this.prisma.comment.findUnique({ where: { id } });
      console.log(idComment);
      const userCreatePost = await this.prisma.post.findUnique({
        where: { id: idComment.postId },
      });
      if (
        req.user?.id === idComment.createdBy ||
        req.user?.id === userCreatePost.createdBy
      ) {
        const result = await this.prisma.comment.update({
          data: {
            postId: idComment.postId,
            content: idComment.content,
            createdBy: idComment.createdBy,
            resolved: false,
            isDeleted: true,
            deletedAt: new Date(),
          },
          where: { id },
        });
        return { data: result, message: 'add comment successfully' };
      } else {
        throw new HttpException(
          { message: 'Can access' },
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async answerComment(
    commentDto: CreateCommentDto,
    id: number,
    req: CustomRequest,
  ) {
    try {
      const idComment = await this.prisma.comment.findUnique({ where: { id } });
      console.log(idComment);
      const { comment } = commentDto;
      const result = await this.prisma.comment.create({
        data: {
          postId: idComment.postId,
          content: comment,
          createdBy: idComment.createdBy,
          resolved: false,
          parentId: id,
        },
      });
      return { data: result, message: 'add comment successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async toggleResolve(id: number, req: CustomRequest) {
    try {
      //kiếm tra xem id truyền vào thuôc comment nào
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      //kiểm tra bài post đó là bài post nào dự vào postID
      const userCreatePost = await this.prisma.post.findUnique({
        where: { id: comment.postId },
      });
      //chỉ những người tạo bài post mới được tick resolved
      if (userCreatePost.createdBy !== req.user?.id) {
        throw new HttpException(
          'Not permission to access',
          HttpStatus.FORBIDDEN,
        );
      }
      //kiem tra comment đó thuộc bài post nào và trả về 1 object
      const post = await this.prisma.comment.findMany({
        where: { postId: comment.postId },
      });
      //nếu comment đó được tick true rôi thì chuyển thành false
      if (comment.resolved === true) {
        await this.prisma.comment.update({
          where: { id: comment.id },
          data: { resolved: false },
        });
      } else {
        //kiểm tra xem trong post object có bài nào được tick true không
        const resolveComment = post.find((c) => c.resolved);
        //nếu được tích true thì bắn ra message
        if (resolveComment) {
          throw new HttpException(
            'Only one comment can be resolved at a time',
            HttpStatus.BAD_REQUEST,
          );
        }
        //nếu không có thì tiến hành cập nhật comment đó thành true
        await this.prisma.comment.update({
          where: { id },
          data: { resolved: true },
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
