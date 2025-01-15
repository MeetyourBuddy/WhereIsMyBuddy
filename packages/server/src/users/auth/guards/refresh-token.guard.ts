import {
  Injectable,
  UnauthorizedException,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  canActivate(context: ExecutionContext) {
    // Get the token from the Authorization header
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      this.logger.error('No refresh token provided');
      throw new UnauthorizedException('No refresh token provided');
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    // Handle specific JWT errors
    if (
      info?.name === 'JsonWebTokenError' ||
      info?.message === 'invalid signature'
    ) {
      this.logger.error('Invalid refresh token signature');
      throw new UnauthorizedException('Invalid refresh token signature');
    }

    if (info?.name === 'TokenExpiredError') {
      this.logger.error('Refresh token has expired');
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (err || !user) {
      this.logger.error('Refresh token validation failed', {
        error: err?.message || 'No user found',
        info: info?.message,
      });
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.logger.debug('Refresh token validation successful', {
      userId: user.sub,
    });

    return user as TUser;
  }
}
