import { IsEmail, IsString } from 'class-validator';
export class TagDto {
  @IsString()
  
  name: string;
}
