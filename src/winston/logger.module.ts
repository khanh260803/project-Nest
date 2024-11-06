import { Module } from '@nestjs/common';
import { Logger } from 'winston';
import * as winston from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();
const logLevel = process.env.LOG_LEVEL || 'info';

export const winstonLogger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

@Module({
  providers: [
    {
      provide: Logger,
      useValue: winstonLogger,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
