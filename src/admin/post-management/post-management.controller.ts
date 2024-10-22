import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PostManagementService } from './post-management.service';
import { CreatePostManagementDto } from './dto/create-post-management.dto';
import { UpdatePostManagementDto } from './dto/update-post-management.dto';
import { CustomRequest } from 'src/custom-request';

@Controller('post-management')
export class PostManagementController {
  constructor(private readonly postManagementService: PostManagementService) {}
  @Post('add-post')
  async createPost(
    @Body() postDto: CreatePostManagementDto,
    @Req() req: CustomRequest,
  ) {
    return this.postManagementService.addPost(postDto, req);
  }

  @Post(':id/edit-post')
  async editPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: CreatePostManagementDto,
    @Req() req: CustomRequest,
  ) {
    return this.postManagementService.editPost(id, postDto, req);
  }

  @Put(':id/soft-delete')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.postManagementService.softDelete(id);
  }
  @Get('get-post')
  async getAllCompany() {
    return this.postManagementService.getAllCompany();
  }

  @Put(':id/restore')
  restoreCompany(@Param('id', ParseIntPipe) id: number) {
    return this.postManagementService.restorePost(id);
  }
}
