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
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { CustomRequest } from 'src/custom-request';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':id/comment')
  async toggleLike(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: CustomRequest,
  ) {
    return this.likeService.toggleLike(commentId, req);
  }

  @Get(':commentId/count')
  async getCountLike(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.likeService.getCountLike(commentId);
  }
}
