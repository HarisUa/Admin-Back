import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserModel } from '@shared/models';

import { ExtendedRequestInterface } from '../interfaces';

/**
 * Get user from request.user
 */
export const User = createParamDecorator((data: keyof UserModel['_attributes'], ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExtendedRequestInterface>();
  const user = request.user;

  return data ? user?.[data] : user;
});
