import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TagDto } from './dto/create-tag-management.dto';
import { UpdateTagManagementDto } from './dto/update-tag-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Tag } from '@prisma/client';

@Injectable()
export class TagManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async addTag(
    tagDto: TagDto,
    req: CustomRequest,
  ): Promise<{ data: Tag; message: string }> {
    try {
      const { name } = tagDto;
      const result = await this.prisma.tag.create({
        data: {
          name: name,
          createdBy: req.user.id,
        },
      });
      return {
        data: result,
        message: 'Add Tag successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editTag(
    tagDto: TagDto,
    req: CustomRequest,
    id: number,
  ): Promise<{ data: Tag; message: string }> {
    try {
      const { name } = tagDto;
      console.log(name);
      const result = await this.prisma.tag.update({
        data: { name: name },
        where: { id },
      });
      return {
        data: result,
        message: 'Edit tag successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softDeleteTag(id: number): Promise<{ data: Tag; message: string }> {
    try {
      const result = await this.prisma.tag.update({
        data: { isDeleted: true, deletedAt: new Date() },
        where: { id },
      });
      return {
        data: result,
        message: 'soft delete successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async restoreTag(id: number): Promise<{ data: Tag; message: string }> {
    try {
      const result = await this.prisma.tag.update({
        data: { isDeleted: false, deletedAt: null },
        where: { id },
      });
      return {
        data: result,
        message: 'restore tag successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTag(): Promise<{ data: Tag[]; message: string }> {
    try {
      const tag = await this.prisma.tag.findMany({
        where: { isDeleted: false },
      });
      console.log(tag);
      if (tag.length === 0) {
        throw new HttpException({ message: 'No Tag' }, HttpStatus.BAD_REQUEST);
      }
      return { data: tag, message: 'fetch data success' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
