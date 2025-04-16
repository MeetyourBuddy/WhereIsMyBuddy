import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const logger = new Logger('GetUserDecorator');
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      logger.error('User not found in request');
      throw new UnauthorizedException('User not found in request');
    }

    if (data) {
      if (!(data in user)) {
        logger.error(`User property ${data} not found`);
        throw new UnauthorizedException(`User property ${data} not found`);
      }
      logger.debug(`Accessing user property: ${data}`);

      console.log('user details', user);
      return user[data];
    }

    logger.debug('Returning full user object');
    return user;
  },
);
