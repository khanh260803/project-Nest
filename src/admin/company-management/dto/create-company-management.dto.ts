import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '@prisma/client';
export class createNewCompany {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  maxUsers: number;

  @IsNotEmpty()
  expiredAt: Date;

  @IsNotEmpty()
  status: Status;
}
