import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Handle BadRequestException (including validation errors)
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      
      return response.status(status).json({
        success: false,
        message: typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : exceptionResponse.message,
        errors: Array.isArray(exceptionResponse.message) 
          ? this.formatErrors(exceptionResponse.message) 
          : null,
      });
    }

    // Handle other HTTP exceptions
    return response.status(status).json({
      success: false,
      message: exception.message,
    });
  }

  private formatErrors(errors: string[]) {
    if (!Array.isArray(errors)) return [];
    
    return errors.map(error => ({
      message: error,
    }));
  }
}