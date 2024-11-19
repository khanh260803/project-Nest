import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { v4 as uuidv4 } from 'uuid';
  
  interface Response<T> {
    requestID: string;
    data: T;
    message: string;
    timestamp: string;
    path: string;
    err: any;
  }
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler<T>,
    ): Observable<Response<T>> {
      const request = context.switchToHttp().getRequest();
      const path = request.url;
  
      const requestID = request.headers['x-correlation-id'];
  
      return next.handle().pipe(
        map((data) => ({
          requestID,
          data,
          message: request.message,
          timestamp: new Date().toISOString(),
          path,
          err: null,
        })),
      );
    }
  }
  