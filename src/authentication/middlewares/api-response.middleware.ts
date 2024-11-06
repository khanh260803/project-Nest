import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestID = req.headers['x-correlation-id'] || uuidv4();
    (req as any).requestID = requestID;

    const { method, originalUrl } = req;
    const startTime = Date.now();

    this.logger.info(
      `[${requestID}] ${method} ${originalUrl} - Request started`,
    );

    const oldJson = res.json;
    // Ghi đè hàm res.json để chuẩn hóa response và ghi log
    res.json = (body: any) => {
      const { data = null, message = 'Request completed', error } = body;
      const responseTime = Date.now() - startTime;

      // // Chuẩn hóa response
      const formattedResponse = {
        requestID,
        data,
        message,
        err: error,
      };

      this.logger.info(
        `[${requestID}] ${method} ${originalUrl} - Completed in ${responseTime}ms with status ${res.statusCode}`,
      );

      return oldJson.call(res, formattedResponse);
    };

    next();
  }
}
