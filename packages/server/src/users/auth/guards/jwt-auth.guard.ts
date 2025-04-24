import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Auth guard user:', user); // Debug log

    // Make sure we attach the complete user object
    if (user && user.userId) {
      request.user = {
        userId: user.userId,
        email: user.email,
      };
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Route is public, skipping authentication');
      return true;
    }

    // Handle the Observable return type
    const canActivate = await super.canActivate(context);
    return canActivate instanceof Observable
      ? await firstValueFrom(canActivate)
      : canActivate;
  }

  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      this.logger.error('Authentication failed', {
        error: err?.message || 'No user found',
        info: info?.message,
      });

      throw (
        err ||
        new UnauthorizedException(info?.message || 'Authentication failed')
      );
    }

    this.logger.debug('Authentication successful', {
      userId: user.userId,
      email: user.email,
    });

    return user;
  }
}
