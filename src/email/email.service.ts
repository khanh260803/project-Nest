import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });
  }

  async sendMail(to: string, subject: string, htmlContent: string) {
    const info = await this.transporter.sendMail({
      from: '"Resolved Management" <no-reply@nestjs.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Message sent: ${info.messageId}`);
  }
}
