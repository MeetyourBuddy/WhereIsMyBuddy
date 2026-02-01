import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

/**
 * Optional JWT guard: validates the Bearer token when present and sets request.user,
 * but never rejects the request. Used for routes that work for both guests and
 * authenticated users (e.g. GET /activities so we can add currentUserJoinRequestStatus when logged in).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const result = await super.canActivate(context);
      return result instanceof Observable ? await firstValueFrom(result) : result;
    } catch {
      // No token or invalid token: allow the request and leave request.user unset
      request.user = undefined;
      return true;
    }
  }

  handleRequest<TUser = { userId: string; email?: string }>(
    err: unknown,
    user: unknown,
    _info?: unknown,
    _context?: ExecutionContext,
    _status?: unknown,
  ): TUser | undefined {
    if (err || !user) {
      return undefined;
    }
    const u = user as { userId?: string; email?: string };
    return (u?.userId ? { userId: u.userId, email: u.email } : undefined) as TUser | undefined;
  }
}
