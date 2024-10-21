import { MinLength } from 'class-validator';
export class ResetPassDto {
  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPass: string;
}
