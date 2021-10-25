import { Request } from 'express';

import { UserModel } from '@shared/models';

import { TokenPayloadInterface } from './token-payload.interface';

/**
 * extended request data interface
 * @export
 * @interface ExtendedRequestInterface
 * @extends {Request}
 */
export interface ExtendedRequestInterface extends Request {
  user?: UserModel;
  tokenPayload: TokenPayloadInterface;
}
