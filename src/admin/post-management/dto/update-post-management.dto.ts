import { PartialType } from '@nestjs/mapped-types';
import { CreatePostManagementDto } from './create-post-management.dto';

export class UpdatePostManagementDto extends PartialType(CreatePostManagementDto) {}
