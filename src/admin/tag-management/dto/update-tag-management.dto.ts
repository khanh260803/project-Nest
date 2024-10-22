import { PartialType } from '@nestjs/mapped-types';
import { TagDto } from './create-tag-management.dto';

export class UpdateTagManagementDto extends PartialType(TagDto) {}
