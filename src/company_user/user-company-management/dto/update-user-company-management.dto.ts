import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCompanyManagementDto } from './create-user-company-management.dto';
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

export class UpdateUserCompanyManagementDto extends PartialType(
  CreateUserCompanyManagementDto,
) {
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
