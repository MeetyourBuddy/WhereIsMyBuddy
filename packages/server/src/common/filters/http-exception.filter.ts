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
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    this.logger.error(`Http Exception: ${JSON.stringify(exceptionResponse)}`);

    // Handle BadRequestException (including validation errors)
    if (exception instanceof BadRequestException) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        success: false,
        message: typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : (exceptionResponse as any).message,
        errors: Array.isArray((exceptionResponse as any).message)
          ? this.formatErrors((exceptionResponse as any).message)
          : null,
      });
    }

    // Handle other HTTP exceptions
    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Internal server error',
    });
  }

  private formatErrors(errors: string[]) {
    if (!Array.isArray(errors)) return [];
    return errors.map((error) => ({
      message: error,
    }));
  }
}
