import {
  IsDataURI,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status, UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
export class CreateUserManagementDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  companyId?: number;
}
