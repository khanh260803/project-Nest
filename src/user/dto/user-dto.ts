import { Type } from 'class-transformer';
import {
  IsEmail,
  MinLength,
  Matches,
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class UserSettingDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dob: Date;

  @IsString()
  @MinLength(5)
  newPass: string;

  @IsString()
  @MinLength(5)
  confirmPass: string;

  @IsOptional()
  image?: Express.Multer.File;
}
