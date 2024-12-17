import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.error('Refresh token validation failed', {
        error: err?.message || 'No user found',
        info: info?.message,
      });

      throw (
        err ||
        new UnauthorizedException(info?.message || 'Invalid refresh token')
      );
    }

    this.logger.debug('Refresh token validation successful', {
      userId: user.sub,
    });

    return user;
  }
}
