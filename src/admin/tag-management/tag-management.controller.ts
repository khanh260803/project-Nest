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
import { Roles } from 'src/authentication/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('tag-management')
export class TagManagementController {
  constructor(private readonly tagManagementService: TagManagementService) {}

  @Get('get-tag')
  @Roles(UserRole.Admin)
  async getAllTopic() {
    return this.tagManagementService.getAllTag();
  }

  @Post('add-tag')
  @Roles(UserRole.Admin)
  async addTag(@Body() tagDto: TagDto, @Req() req: CustomRequest) {
    return this.tagManagementService.addTag(tagDto, req);
  }

  @Put(':id/edit-tag')
  @Roles(UserRole.Admin)
  async editTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() tagDto: TagDto,
    @Req() req: CustomRequest,
  ) {
    return this.tagManagementService.editTag(tagDto, req, id);
  }

  @Put(':id/soft-delete')
  @Roles(UserRole.Admin)
  async softDeleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagManagementService.softDeleteTag(id);
  }

  @Put(':id/restore')
  @Roles(UserRole.Admin)
  async restoreTopic(@Param('id', ParseIntPipe) id: number) {
    return this.tagManagementService.restoreTag(id);
  }
}
