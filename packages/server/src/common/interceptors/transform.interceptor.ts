/*
- Wraps all successful responses in a standard format
- Example response:
{
  "data": { "id": 1, "name": "John" },
  "timestamp": "2024-01-01T00:00:00.000Z"
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

interface Response<T> {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((response) => {
        // If response is already formatted (has success field), return as is with timestamp
        if (response?.success !== undefined) {
          return {
            ...response,
            timestamp: new Date().toISOString(),
          };
        }

        // Otherwise, wrap the response in data field
        return {
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
