import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('test-email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async sendTestMail(to: string, subject: string, htmlContent: string) {
    return this.emailService.sendMail(to, subject, htmlContent);
  }
}
