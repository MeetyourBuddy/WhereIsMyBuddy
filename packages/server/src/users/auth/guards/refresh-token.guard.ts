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
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.debug('Received authorization header', {
      header: authHeader?.substring(0, 20) + '...', // Log first 20 chars for debugging
    });

    // Improved token extraction and validation
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token || token.trim() === '') {
      this.logger.error('No refresh token provided');
      throw new UnauthorizedException('No refresh token provided');
    }

    // Store token in request for potential use in strategy
    request.refreshToken = token;

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    // More detailed error logging
    if (info || err) {
      this.logger.error('Token validation failed', {
        error: err?.message,
        info: info?.message,
        errorName: info?.name,
      });
    }

    // Handle specific JWT errors with more detailed messages
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException(
        'Invalid refresh token format or signature',
      );
    }

    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (err || !user) {
      throw new UnauthorizedException(
        err?.message || 'Refresh token validation failed',
      );
    }

    this.logger.debug('Refresh token validation successful', {
      userId: user.sub,
    });

    return user as TUser;
  }
}
