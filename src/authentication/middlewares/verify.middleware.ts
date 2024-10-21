import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from 'src/custom-request';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Lấy token từ header cookie
      const cookies = req.headers.cookie?.split('; ') ?? [];
      const refreshToken = cookies
        .find((c) => c.startsWith('refreshToken='))
        ?.split('=')[1];

      if (!refreshToken) {
        throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
      }

      // Xác minh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET_TOKEN,
      });

      // Gán thông tin user vào request
      req.user = decoded;

      next(); // Chuyển tiếp nếu thành công
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
