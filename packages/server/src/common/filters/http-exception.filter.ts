/*
- This is a utility for handling HTTP exceptions
- It is used to return a standard error response from the API
{
  "statusCode": 404,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "User not found",
  "path": "/api/users/123"
}
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    this.logger.error(`Http Exception: ${JSON.stringify(exceptionResponse)}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
      path: ctx.getRequest().url,
    });
  }
}
