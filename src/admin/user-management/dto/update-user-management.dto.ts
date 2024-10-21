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
export class UpdateUserManagementDto {
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
