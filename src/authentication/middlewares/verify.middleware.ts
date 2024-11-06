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
      const accessToken = cookies
        .find((c) => c.startsWith('accessToken='))
        ?.split('=')[1];

      // Kiểm tra nếu không có refreshToken, chuyển hướng đến trang login
      if (!accessToken) {
        return res.redirect('http://localhost:3000/pages/auth/login');
      }

      // Xác minh token
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.SECRET_TOKEN,
      });

      // Gán thông tin user vào request
      req.user = decoded;

      next(); // Chuyển tiếp nếu thành công
    } catch (error) {
      console.error('JWT Verification Error:', error);
      // Khi token không hợp lệ hoặc hết hạn, chuyển hướng đến trang login
      return res.redirect('http://localhost:3000/pages/auth/login');
    }
  }
}
