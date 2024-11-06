import { IsNotEmpty, MinLength } from 'class-validator';
export class ResetPassDto {
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @MinLength(6)
  @IsNotEmpty()
  confirmPass: string;
}
