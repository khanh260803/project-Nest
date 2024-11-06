import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { winstonLogger } from 'src/winston/winston-logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    //phương thức catch
    const ctx = host.switchToHttp(); //chuyển dổi từ ArgumentsHost sang http
    const response = ctx.getResponse<Response>(); //lấy đối tượng từ  phản hồi
    const request = ctx.getRequest<Request>(); //lấy đối tượng từ  yêu cầu
    const status = exception.getStatus(); //lấy mã trạng thái http từ ngoại lệ
    const correlationID = request.headers['x-correlation-id'] || 'N/A';

    // Log lỗi với Winston
    winstonLogger.error({
      message: exception.message,
      method: request.method,
      url: request.url,
      stack: exception.stack,
      correlationID,
      className: this.constructor.name, // Thêm tên lớp
      methodName: 'catch', // Thêm tên phương thức
      requestBody: request.body, // Ghi lại body yêu cầu nếu cần
      queryParams: request.query, // Ghi lại các tham số truy vấn
    });

    let customMessage: string;
    let validationErrors: any[] = [];

    // Kiểm tra xem lỗi có phải là BadRequestException hay không
    if (exception instanceof BadRequestException) {
      const responseBody = exception.getResponse();

      // Nếu responseBody là đối tượng và có trường message
      if (typeof responseBody === 'object' && responseBody['message']) {
        // Nếu message là mảng, lấy tất cả thông báo lỗi
        validationErrors = Array.isArray(responseBody['message'])
          ? responseBody['message']
          : [responseBody['message']];
      } else if (typeof responseBody === 'string') {
        // Nếu responseBody là chuỗi, thêm nó vào validationErrors
        validationErrors.push(responseBody);
      }
    }

    // Tùy chỉnh message dựa trên mã trạng thái
    switch (status) {
      case 400:
        customMessage = 'Bad Request: Please check your input.';
        break;
      case 401:
        customMessage = 'Unauthorized: Access is denied.';
        break;
      case 403:
        customMessage = 'Forbidden: You do not have permission.';
        break;
      case 404:
        customMessage = 'Not Found: The requested resource could not be found.';
        break;
      case 500:
      default:
        customMessage = 'Internal Server Error: Something went wrong.';
        break;
    }

    const responseBody = {
      requestID: correlationID,
      data: null,
      message:
        validationErrors.length > 0
          ? validationErrors.join(', ') // Sử dụng thông báo từ validationErrors
          : exception.message,
      error: {
        status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(responseBody);
  }
}
