import { IsEmail, MinLength, Matches, IsString } from 'class-validator';

export class UserSettingDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  newPass: string;

  @MinLength(6)
  comfirmPass: string;

  @Matches(/^[0-9]{10,11}$/, {
    message: 'Phone number must be 10 or 11 digits',
  })
  phone: string;

  @IsString()
  image: string;
}
