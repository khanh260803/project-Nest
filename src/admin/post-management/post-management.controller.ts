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
import { Roles } from 'src/common/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

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
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async getAllCompany() {
    return this.postManagementService.getAllCompany();
  }

  @Put(':id/restore')
  @Roles(UserRole.Admin)
  async restoreCompany(@Param('id', ParseIntPipe) id: number) {
    return this.postManagementService.restorePost(id);
  }
  @Put(':id/pin')
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async pinPost(@Param('id', ParseIntPipe) id: number) {
    return this.postManagementService.pinPost(id);
  }

  //api lay 5 bai post gan nhat
  @Get('get-lastest-post')
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async getLastestPost() {
    return this.postManagementService.getLastestPost();
  }
}
