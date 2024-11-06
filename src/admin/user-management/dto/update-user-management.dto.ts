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
export class UpdateUserManagementDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  companyId?: number;
}
