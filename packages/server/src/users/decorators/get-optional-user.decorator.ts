import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const GetOptionalUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const logger = new Logger('GetOptionalUserDecorator');
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      logger.debug('No user found in request (optional)');
      return undefined;
    }

    if (data) {
      if (!(data in user)) {
        logger.warn(`User property ${data} not found`);
        return undefined;
      }
      logger.debug(`Accessing user property: ${data}`);
      return user[data];
    }

    logger.debug('Returning full user object');
    return user;
  },
);
