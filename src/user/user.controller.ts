import { Body, Controller, Post, Req, Get, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSettingDto } from './dto/user-dto';
import { CustomRequest } from 'src/custom-request';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('logout')
  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    return this.userService.logout(req, res);
  }
  @Post('userSetting')
  async updateUser(
    @Body() userSettingDto: UserSettingDto,
    @Req() req: CustomRequest,
  ) {
    return this.userService.updateUser(userSettingDto, req);
  }

  @Get('userInfo')
  async getAllUser(@Req() req: CustomRequest) {
    return this.userService.getAllUser(req);
  }
}
