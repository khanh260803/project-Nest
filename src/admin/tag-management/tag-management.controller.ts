import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { TagManagementService } from './tag-management.service';
import { TagDto } from './dto/create-tag-management.dto';
import { UpdateTagManagementDto } from './dto/update-tag-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';

@Controller('tag-management')
export class TagManagementController {
  constructor(private readonly tagManagementService: TagManagementService) {}

  @Get('get-tag')
  async getAllTopic() {
    return this.tagManagementService.getAllTag();
  }

  @Post('add-tag')
  async addTag(@Body() tagDto: TagDto, @Req() req: CustomRequest) {
    return this.tagManagementService.addTag(tagDto, req);
  }

  @Put(':id/edit-tag')
  async editTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() tagDto: TagDto,
    @Req() req: CustomRequest,
  ) {
    return this.tagManagementService.editTag(tagDto, req, id);
  }

  @Put(':id/soft-delete')
  async softDeleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagManagementService.softDeleteTag(id);
  }

  @Put(':id/restore')
  async restoreTopic(@Param('id', ParseIntPipe) id: number) {
    return this.tagManagementService.restoreTag(id);
  }
}
