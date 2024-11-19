import { Injectable, NestMiddleware } from '@nestjs/common';
import { asyncLocalStorage } from 'src/async-local-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.headers['x-correlation-id'] = correlationId; // Gắn vào header của request

    asyncLocalStorage.run(new Map(), () => {
      asyncLocalStorage.getStore().set('correlationId', correlationId);
      next();
    });
  }
}
