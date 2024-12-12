import { 
    Injectable, 
    ExecutionContext,
    UnauthorizedException,
    Logger 
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class GoogleAuthGuard extends AuthGuard('google') {
    private readonly logger = new Logger(GoogleAuthGuard.name);
  
    async canActivate(context: ExecutionContext) {
      const activate = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();
  
      await super.logIn(request);
      return activate;
    }
  
    handleRequest(err: any, user: any, info: any) {
      if (err || !user) {
        this.logger.error('Google authentication failed', {
          error: err?.message || 'No user found',
          info: info?.message,
        });
  
        throw err || new UnauthorizedException(
          info?.message || 'Google authentication failed',
        );
      }
  
      this.logger.debug('Google authentication successful', {
        email: user.email,
        googleId: user.googleId,
      });
  
      return user;
    }
  }