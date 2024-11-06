import {
  IsDataURI,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status, UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
export class CreateUserManagementDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  companyId?: number;
}
