import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TopicManagementService } from './topic-management.service';
import { TopicDto } from './dto/create-topic-management.dto';
import { CustomRequest } from 'src/custom-request';
import { Roles } from 'src/authentication/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('topic-management')
export class TopicManagementController {
  constructor(
    private readonly topicManagementService: TopicManagementService,
  ) {}

  @Get('get-topic')
  @Roles(UserRole.Admin)
  async getAllTopic() {
    return this.topicManagementService.getAllTopic();
  }

  @Post('add-topic')
  @Roles(UserRole.Admin)
  async addTopic(@Body() topicData: TopicDto, @Req() req: CustomRequest) {
    return this.topicManagementService.addTopic(topicData, req);
  }

  @Put(':id/edit-topic')
  @Roles(UserRole.Admin)
  async editTopic(
    @Param('id', ParseIntPipe) id: number,
    @Body() topicData: TopicDto,
    @Req() req: CustomRequest,
  ) {
    return this.topicManagementService.editTopic(topicData, req, id);
  }

  @Put(':id/soft-delete')
  @Roles(UserRole.Admin)
  async softDeleteTopic(@Param('id', ParseIntPipe) id: number) {
    return this.topicManagementService.softDeleteTopic(id);
  }

  @Put(':id/restore-topic')
  @Roles(UserRole.Admin)
  async restoreTopic(@Param('id', ParseIntPipe) id: number) {
    return this.topicManagementService.restoreTopic(id);
  }


}
