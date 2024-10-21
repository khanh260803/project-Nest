import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import {
  ForgetDto,
  LoginDto,
  OtpDto,
  RegisterDto,
  ResetDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cache } from '@nestjs/cache-manager';
import { Response, Request } from 'express';
import { access } from 'fs';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    @Inject(Cache) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username, role, dob } = registerDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new HttpException(
        { message: 'user exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hash_pass = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hash_pass,
        role: 'Member',
      },
    });
    return {
      message: 'Create user successfull',
      newUser,
    };
  }
  //API LOGIN
  async login(loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    //xác thực thông tin người dùng,đầu vào
    const { email, password } = loginDto;
    //tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user.isDeleted === true) {
      throw new HttpException(
        { message: 'your account is not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.status === 'inActive') {
      throw new HttpException(
        { message: 'your account is ban' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(
        { message: 'User not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    //kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new HttpException(
        { message: 'Password not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    //tạo token và trả về jsontoken
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.SECRET_TOKEN,
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.REFRESH_SECRET_TOKEN,
      expiresIn: '7h',
    });
    //luu token va re
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    //lưu token vào trong cache để sử dụng
    await this.cacheManager.set(`token_${accessToken}`, true, 1000000);
    //lưu vào cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return { message: 'Login succesfull', accessToken, refreshToken };
  }
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh = req.headers.cookie?.split(';'); //chuyen thanh 1 mang

    const token = refresh
      ?.find((c) => c.startsWith('refreshToken'))
      ?.split('=')[1];
    const payload = this.jwt.verify(token, {
      secret: process.env.REFRESH_SECRET_TOKEN,
    });
    const accessToken = this.jwt.sign(
      { id: payload.id, email: payload.email },
      { secret: process.env.REFRESH_SECRET_TOKEN, expiresIn: '1h' },
    );
    return { accessToken };
  }

  //gernerate ramdom number
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //API SEND OTP
  async sendOtp(forgetDto: ForgetDto) {
    const { email } = forgetDto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new HttpException(
          { message: 'User not exist' },
          HttpStatus.NOT_FOUND,
        );
      }

      const ramdomNumber = this.getRandomNumber(1000, 9000);
      await this.cacheManager.set(`otp`, ramdomNumber, 300000);
      await this.cacheManager.set(`email`, email, 300000);
      console.log(`OTP ${ramdomNumber} cached for ${email}`);

      return {
        message: 'Random number generated and cached successfully',
        ramdomNumber,
      };
    } catch (error) {
      console.log(error);
    }
  }
  //API VERIFY OTP
  async verifyOtp(otpDto: OtpDto) {
    const { ramdomNum } = otpDto;

    const cachedOtp = await this.cacheManager.get(`otp`);
    console.log('cache', cachedOtp);
    if (!cachedOtp) {
      throw new HttpException(
        { message: 'Otp is not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (cachedOtp !== ramdomNum) {
      throw new HttpException(
        { message: 'Otp is incorrect' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Otp is coreect',
    };
  }
  //API RESET PASSWORD
  async resetPass(resetDto: ResetDto) {
    const { newPass, comfirmPass } = resetDto;
    const email = await this.cacheManager.get<string>('email');
    console.log('email:', email);

    if (newPass !== comfirmPass) {
      throw new HttpException(
        { message: 'New Password not match with comfirm password' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hassPass = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hassPass },
    });
    return {
      message: 'reset password successfull',
      hassPass,
    };
  }

  async loginV2(loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    //xác thực thông tin người dùng,đầu vào
    const { email, password } = loginDto;
    //tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user.isDeleted === true) {
      throw new HttpException(
        { message: 'your account is not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.status === 'inActive') {
      throw new HttpException(
        { message: 'your account is ban' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(
        { message: 'User not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    //kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new HttpException(
        { message: 'Password not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    //tạo token và trả về jsontoken
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.SECRET_TOKEN,
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.REFRESH_SECRET_TOKEN,
      expiresIn: '7h',
    });
    //luu token va re
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    //lưu token vào trong cache để sử dụng
    const token = await this.redis.set('token', accessToken, 'EX', 100000);
    console.log(token);
    console.log(await this.redis.get('token'));
    //lưu vào cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return { message: 'Login succesfull version 2', accessToken, refreshToken };
  }
}
