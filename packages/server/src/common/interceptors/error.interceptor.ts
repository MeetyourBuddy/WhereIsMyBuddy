import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const response = {
          success: false,
          message: error.message || 'Internal server error',
          data: null,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
          ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
          }),
        };

        if (error instanceof HttpException) {
          return throwError(() => ({
            ...response,
            statusCode: error.getStatus(),
          }));
        }

        return throwError(() => ({
          ...response,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }));
      }),
    );
  }
}
