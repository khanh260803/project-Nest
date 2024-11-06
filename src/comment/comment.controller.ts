import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CustomRequest } from 'src/custom-request';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id/add-comment') //id là id bài post
  async addComment(
    @Body() commentDto: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    return this.commentService.addComment(commentDto, id, req);
  }

  @Put(':id/edit-comment')
  async editComment(
    @Body() commentDto: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    return this.commentService.editComment(commentDto, id, req);
  }
  @Get(':id/comment')
  async getComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getComment(id);
  }

  @Put(':id/soft-delete')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    return this.commentService.softDelete(id, req);
  }

  @Post(':id/answer') //id của comment
  async answerComment(
    @Body() commentDto: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    return this.commentService.answerComment(commentDto, id, req);
  }

  @Put(':id/resolved')
  async toggleResolve(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    return this.commentService.toggleResolve(id, req);
  }
}
