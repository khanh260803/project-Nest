import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgetDto,
  LoginDto,
  OtpDto,
  RegisterDto,
  ResetDto,
} from './dto/create-auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Version('1')
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Version('2') // Tạo logic mới cho phiên bản 2
  @Post('login')
  async loginV2(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginV2(loginDto, res);
    return { message: 'Welcome to login V2!', data: result };
  }

  @Post('forget')
  async forget(@Body() forgetDto: ForgetDto) {
    return this.authService.sendOtp(forgetDto);
  }

  @Post('otp')
  async enterOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyOtp(otpDto);
  }

  @Post('resetPass')
  async resetPass(@Body() resetDto: ResetDto) {
    return this.authService.resetPass(resetDto);
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
