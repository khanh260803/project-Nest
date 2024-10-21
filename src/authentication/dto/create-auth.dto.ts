import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsNumber,
} from 'class-validator';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  role: UserRole;

  dob: Date;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class ForgetDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class OtpDto {
  @IsNotEmpty()
  @IsNumber()
  ramdomNum: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class ResetDto {
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be 6 characters' })
  newPass: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be 6 characters' })
  comfirmPass: string;
}
