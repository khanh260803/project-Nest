import { Injectable, Body, Req, Param } from '@nestjs/common';
import { TopicDto } from './dto/create-topic-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';

@Injectable()
export class TopicManagementService {
  constructor(private readonly prismaService: PrismaService) {}

  async addTopic(@Body() topicData: TopicDto, @Req() req: CustomRequest) {
    const { name } = topicData;
    await this.prismaService.topic.create({
      data: {
        title: name,
        createdBy: req.user.id,
      },
    });
    return { message: 'create topic successful' };
  }

  //edit topic
  async editTopic(
    @Body() topicData: TopicDto,
    @Req() req: CustomRequest,
    id: number,
  ) {
    const { name } = topicData;
    console.log(name);
    await this.prismaService.topic.update({
      data: { title: name },
      where: { id },
    });
    return { message: 'edit topic successful' };
  }

  //delete topic
  async softDeleteTopic(id: number) {
    await this.prismaService.topic.update({
      data: { isDeleted: true, deletedAt: new Date() },
      where: { id },
    });
    return { message: 'delete topic successful' };
  }
  async getAllTopic() {
    const topic = await this.prismaService.topic.findMany({
      where: { isDeleted: false },
    });
    return { message: 'fetch data topic ', topic };
  }
  //restore topic
  async restoreTopic(id: number) {
    await this.prismaService.topic.update({
      data: { isDeleted: false, deletedAt: null },
      where: { id },
    });
    return { message: 'restore topic successful' };
  }
}
