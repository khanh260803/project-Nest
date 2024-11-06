import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePostManagementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  topicID: number;

  @IsNotEmpty()
  @IsNumber()
  tagID: number;

  @IsNotEmpty()
  @IsBoolean()
  pinned: boolean;
}
