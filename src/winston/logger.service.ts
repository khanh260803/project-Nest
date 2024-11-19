// logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { winstonConfig } from './logger.config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(winstonConfig);
  }

  log(message: string, context?: string, meta: object = {}): void {
    this.logger.info(this.formatMessage(message, context), {
      context,
      ...meta,
    });
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    meta: object = {},
  ): void {
    this.logger.error(this.formatMessage(message, context), {
      trace,
      context,
      ...meta,
    });
  }

  warn(message: string, context?: string, meta: object = {}): void {
    this.logger.warn(this.formatMessage(message, context), {
      context,
      ...meta,
    });
  }

  debug(message: string, context?: string, meta: object = {}): void {
    this.logger.debug(this.formatMessage(message, context), {
      context,
      ...meta,
    });
  }

  verbose(message: string, context?: string, meta: object = {}): void {
    this.logger.verbose(this.formatMessage(message, context), {
      context,
      ...meta,
    });
  }

  private formatMessage(message: string, context?: string): string {
    return context ? `[${context}] ${message}` : message;
  }
}
