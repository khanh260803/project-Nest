import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePostManagementDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  topicID: number;
  @IsNotEmpty()
  @IsNumber()
  tagID: number;

  @IsNotEmpty()
  @IsBoolean()
  pinned: boolean;
}
