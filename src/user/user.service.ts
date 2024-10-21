import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSettingDto } from './dto/user-dto';
import { CustomRequest } from 'src/custom-request';
import * as bycypt from 'bcrypt';
import { Response } from 'express';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  //update thong tin nguoi dung
  async updateUser(userSettingDto: UserSettingDto, @Req() req: CustomRequest) {
    console.log(userSettingDto);
    console.log(req.user?.role);
    const { email, password, newPass, comfirmPass } = userSettingDto;

    const user = await this.prismaService.user.findUnique({
      where: { email: req.user?.email },
    });
    console.log(user);
    if (!user) {
      throw new HttpException(
        { message: 'user not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!bycypt.compare(password, user.password)) {
      throw new HttpException(
        {
          message: 'Wrong password!Please enter again.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newPass !== comfirmPass) {
      throw new HttpException(
        {
          message: 'New Password not match with Comfirm Password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPass = await bycypt.hash(newPass, 10);

    await this.prismaService.user.update({
      data: { email, password: hashPass },
      where: { email: req.user?.email },
    });
    return { message: 'update profile successfull' };
  }

  //get all user
  async getAllUser(@Req() req: CustomRequest) {
    console.log(req.user?.email);
    const allUser = await this.prismaService.user.findMany();

    return { message: 'fetch data succesfull', allUser };
  }

  //logout

  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: req.user?.email },
    });
  }
}
