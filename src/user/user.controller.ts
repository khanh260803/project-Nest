import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserSettingDto } from './dto/user-dto';
import { CustomRequest } from 'src/custom-request';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('logout')
  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    return this.userService.logout(req, res);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('image')) // Sử dụng Multer để upload file
  async updateUser(
    @Body() userSettingDto: UserSettingDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    // Gán image vào DTO
    userSettingDto.image = image;
    return this.userService.updateUser(userSettingDto, image, req);
  }

  @Get('userInfo')
  async getAllUser(@Req() req: CustomRequest) {
    return this.userService.getAllUser(req);
  }
}
