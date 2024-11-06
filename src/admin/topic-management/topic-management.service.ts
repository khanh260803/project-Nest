import {
  Injectable,
  Body,
  Req,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TopicDto } from './dto/create-topic-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { Topic } from '@prisma/client';
@Injectable()
export class TopicManagementService {
  constructor(private readonly prismaService: PrismaService) {}

  async addTopic(
    @Body() topicData: TopicDto,
    @Req() req: CustomRequest,
  ): Promise<{ data: Topic; message: string }> {
    try {
      const { name } = topicData;
      const result = await this.prismaService.topic.create({
        data: {
          title: name,
          createdBy: req.user.id,
        },
      });
      return {
        data: result,
        message: 'add topic successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //edit topic
  async editTopic(
    @Body() topicData: TopicDto,
    @Req() req: CustomRequest,
    id: number,
  ): Promise<{ data: Topic; message: string }> {
    try {
      const { name } = topicData;
      console.log(name);
      const result = await this.prismaService.topic.update({
        data: { title: name },
        where: { id },
      });
      return {
        data: result,
        message: 'edit topic successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //delete topic
  async softDeleteTopic(id: number): Promise<{ data: Topic; message: string }> {
    try {
      const result = await this.prismaService.topic.update({
        data: { isDeleted: true, deletedAt: new Date() },
        where: { id },
      });
      return {
        data: result,
        message: 'soft delete topic successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTopic(): Promise<{ data: Topic[]; message: string }> {
    try {
      const topic = await this.prismaService.topic.findMany({
        where: { isDeleted: false },
      });
      if (topic.length === 0) {
        throw new HttpException(
          { message: 'No topic' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return { message: 'fetch data topic ', data: topic };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //restore topic
  async restoreTopic(id: number): Promise<{ data: Topic; message: string }> {
    try {
      const result = await this.prismaService.topic.update({
        data: { isDeleted: false, deletedAt: null },
        where: { id },
      });
      return { message: 'restore topic ', data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
