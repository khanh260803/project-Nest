import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '@prisma/client';
export class createNewCompany {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  maxUsers: number;

  @IsNotEmpty()
  expiredAt: Date;

  @IsNotEmpty()
  status: Status;
}
