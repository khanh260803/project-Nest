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
import { User } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    @Inject(Cache) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private emailService: EmailService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ data: User; message: string }> {
    try {
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
        message: 'register successful',
        data: newUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(
    loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    data: { accessToken: string; refreshToken: string };
    message: string;
  }> {
    try {
      const { email, password } = loginDto;
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

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        throw new HttpException(
          { message: 'Password not match' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = this.jwt.sign(payload, {
        secret: process.env.SECRET_TOKEN,
        expiresIn: '1h',
      });
      const refreshToken = this.jwt.sign(payload, {
        secret: process.env.REFRESH_SECRET_TOKEN,
        expiresIn: '7h',
      });

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      await this.cacheManager.set(`token_${accessToken}`, true, 1000000);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return {
        message: 'Login successful',
        data: { accessToken, refreshToken },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh = req.headers.cookie?.split(';');

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
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //API SEND OTP
  async sendOtp(
    forgetDto: ForgetDto,
  ): Promise<{ data: number; message: string }> {
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

      const randomNumber = this.getRandomNumber(1000, 9000);
      await this.cacheManager.set(`otp`, randomNumber, 300000);
      await this.cacheManager.set(`email`, email, 300000);
      console.log(`OTP ${randomNumber} cached for ${email}`);
      const htmlContent = `<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <title>
      
          </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
              #outlook a {
                  padding: 0;
              }
      
              .ReadMsgBody {
                  width: 100%;
              }
      
              .ExternalClass {
                  width: 100%;
              }
      
              .ExternalClass * {
                  line-height: 100%;
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
              }
      
              p {
                  display: block;
                  margin: 13px 0;
              }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
              @media only screen and (max-width:480px) {
                  @-ms-viewport {
                      width: 320px;
                  }
                  @viewport {
                      width: 320px;
                  }
              }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
              <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
          <!--[if lte mso 11]>
              <style type="text/css">
                .outlook-group-fix { width:100% !important; }
              </style>
              <![endif]-->
      
      
          <style type="text/css">
              @media only screen and (min-width:480px) {
                  .mj-column-per-100 {
                      width: 100% !important;
                  }
              }
          </style>
      
      
          <style type="text/css">
          </style>
      
      </head>
      
      <body style="background-color:#f9f9f9;">
      
      
          <div style="background-color:#f9f9f9;">
      
      
              <!--[if mso | IE]>
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                     
                                                  </table>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                      Welcome to Resolve Management
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                      Thân gửi <span style="font-weight:bold">${email}</span><br></br>
                                                     Resolve Management rất vui mừng và tự hào chào đón bạn đến với dịch vụ của chúng tôi.
      Dưới đây là thông tin mã otp tài khoản của bạn:
      
                                                  </br>Your account:
                                                  <p style="font-weight:bold"> -Tên tài khoản: <span style="color:red"> ${email}</span> </br></p>
                                                  <p style="font-weight:bold">  - mã otp:<span style="color:red"> ${randomNumber}</span> </p>
                                                  
                                                  </div> 
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
      
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                      <tr>
                                                          <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                              <p style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                  <a href="http://localhost:3000/setpass" 
                  style="color:#ffffff; text-decoration:none;">
                  Set Your Password
              </a>
                                                              </p>
                                                          </td>
                                                      </tr>
                                                  </table>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                      Best regards,<br><br> Doan duy khanh<br>CEO and Founder<br>
                                                     
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                      <tbody>
                          <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                          <tbody>
                                              <tr>
                                                  <td style="vertical-align:bottom;padding:0;">
      
                                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      
                                                          <tr>
                                                              <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
      
                                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                      Some Firm Ltd, 35 Avenue. City 10115, USA
                                                                  </div>
      
                                                              </td>
                                                          </tr>
      
                                                          <tr>
                                                              <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
      
                                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                      <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                  </div>
      
                                                              </td>
                                                          </tr>
      
                                                      </table>
      
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            <![endif]-->
      
      
          </div>
      
      </body>
      
                  </html>`;
      this.emailService.sendMail(email, `Welcome ${email}`, htmlContent);
      return {
        message: 'Random number generated and cached successfully',
        data: randomNumber,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp(otpDto: OtpDto): Promise<{ data: number; message: string }> {
    try {
      // const emailS1 = await this.cacheManager.get('email');
      // console.log(emailS1);
      const { ramdomNum } = otpDto;
      // if (emailS1 !== email) {
      //   throw new HttpException({ message: 'error' }, HttpStatus.BAD_REQUEST);
      // }
      const cachedOtp = await this.cacheManager.get('otp');
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
        data: cachedOtp,
        message: 'Otp is correct',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPass(
    resetDto: ResetDto,
  ): Promise<{ data: string; message: string }> {
    try {
      const { newPass, confirmPass: confirmPass } = resetDto;
      const email = await this.cacheManager.get<string>('email');
      console.log('email:', email);

      if (newPass !== confirmPass) {
        throw new HttpException(
          { message: 'New Password not match with confirm password' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const hasPass = await bcrypt.hash(newPass, 10);
      const result = await this.prisma.user.update({
        where: { email },
        data: { password: hasPass },
      });
      return {
        message: 'reset password successful',
        data: hasPass,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginV2(loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    console.log(user.role);
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

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new HttpException(
        { message: 'Password not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.SECRET_TOKEN,
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.REFRESH_SECRET_TOKEN,
      expiresIn: '7h',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

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

    return { message: 'Login successful version 2', accessToken, refreshToken };
  }
  async logout(res: Response) {
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.OK).json({
      message: 'Logout thành công',
    });
  }
}
