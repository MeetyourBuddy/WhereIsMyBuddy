/*
- Wraps all successful responses in a standard format
- Example response:
{
  "success": true,
  "data": { "id": 1, "name": "John" },
  "message": "Retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users/1"
}
*/

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Define default messages based on HTTP method
    const defaultMessages = {
      GET: 'Retrieved successfully',
      POST: 'Created successfully',
      PUT: 'Updated successfully',
      PATCH: 'Updated successfully',
      DELETE: 'Deleted successfully',
    };

    return next.handle().pipe(
      map((response) => {
        // If response is already formatted (has success field), return as is with timestamp and path
        if (response?.success !== undefined) {
          return {
            ...response,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // Get the HTTP method
        const method = request.method;

        // Determine the message
        let message: string;
        if (response?.message) {
          // If response contains a message, extract and remove it
          message = response.message;
          delete response.message;
        } else {
          // Use default message based on HTTP method
          message = defaultMessages[method] || 'Operation successful';
        }

        return {
          success: true,
          data: response,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
