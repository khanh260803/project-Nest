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
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UploadService } from 'src/upload/upload.service';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async updateUser(
    userSettingDto: UserSettingDto,
    file: Express.Multer.File, // Handle the uploaded file
    @Req() req: CustomRequest,
  ): Promise<{ data: User; message: string }> {
    try {
      const { newPass, confirmPass, dob, password } = userSettingDto;
      const user = await this.prismaService.user.findUnique({
        where: {
          id: req.user?.id,
        },
      });

      if (password === null) {
        await this.uploadService.uploadImage(file);
        const updatedUser = await this.prismaService.user.update({
          where: { id: req.user?.id },
          data: {
            avatarUrl: file.originalname,
            dob,
          },
        });
        return { data: updatedUser, message: 'update success' };
      } else {
        if (await bcrypt.compare(password, user.password)) {
          if (newPass !== confirmPass) {
            throw new HttpException(
              {
                message: 'password not match with old pas',
              },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const hassPass = await bcrypt.hash(newPass, 10);
            await this.uploadService.uploadImage(file);
            const newUpdate = await this.prismaService.user.update({
              data: { password: hassPass, dob, avatarUrl: file.originalname },
              where: { id: req.user?.id },
            });
            return { data: newUpdate, message: 'update success' };
          }
        } else {
          throw new HttpException(
            {
              message: 'password not match with old pas',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { message: 'Error updating profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUser(@Req() req: CustomRequest) {
    console.log(req.user?.email);
    const allUser = await this.prismaService.user.findMany();

    return { message: 'fetch data successful', allUser };
  }

  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: req.user?.email },
    });
  }
}
