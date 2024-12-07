import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug(
      `JWT Guard called for ${context.getClass().name} - ${context.getHandler().name}`,
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Route is marked as public, skipping authentication');
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {
    this.logger.debug('Handle request called with:', { user, info });

    if (err || !user) {
      this.logger.error('Authentication failed', {
        error: err?.message || 'No user found',
        info,
      });
      throw err || new UnauthorizedException('Authentication failed');
    }

    this.logger.debug('Authentication successful', {
      userId: user.userId,
      email: user.email,
    });
    return user;
  }
}
