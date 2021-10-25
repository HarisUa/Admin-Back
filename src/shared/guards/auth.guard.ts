import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from 'jsonwebtoken';

import { COMMON_HEADERS, ExtendedRequestInterface, TokenPayloadInterface } from '@common';

import { UserModel } from '../models';
import { APP_CONFIG } from '../config';
import { Reflector } from '@nestjs/core';

/**
 * Check user have valid token or not
 * On valid token find user exist in database or not
 * If user exist then set user in request.user
 * Also check whether user have permission to access defined permission on route
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of AuthGuard.
   * @param {typeof UserModel} userModel to do query on users
   */
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private reflector: Reflector,
  ) {}

  /**
   * Define routes can be activate or not
   * @param {ExecutionContext} context
   * @return whether routes can activate or not
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<ExtendedRequestInterface>();

      const accessToken = request.headers[COMMON_HEADERS.X_ACCESS_TOKEN];

      if (!accessToken) {
        return false;
      }

      const tokenData: TokenPayloadInterface = await this.verifyToken(accessToken as string);

      const foundUser = await this.userModel.scope(UserModel.definedScopes.WITH_ACTIVE_ROLES_SHORT).findByPk(tokenData.userId, {
        attributes: { exclude: ['password'] },
      });

      if (!foundUser || !foundUser.isActive) {
        return false;
      }
      request.user = foundUser;
      request.tokenPayload = tokenData;

      return this.checkForPermissions(context, foundUser);
    } catch (error) {
      if (error instanceof JsonWebTokenError || error instanceof NotBeforeError || error instanceof TokenExpiredError) {
        return false;
      }
      throw error;
    }
  }

  /**
   * To verify access token
   * @param {string} token token string
   * @return decoded token data
   */
  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      verify(token, APP_CONFIG.jwtSecretKey, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded);
      });
    });
  }

  /**
   * Find whether user have permission or not
   * @param {ExecutionContext} context nest context
   * @param {UserModel} user sequelize user model
   * @return whether have permission to access or not
   */
  checkForPermissions(context: ExecutionContext, user: UserModel) {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (user.allPermissions || !permissions || !permissions.length) {
      return true;
    }
    return permissions.every((permission) => user.permissionsObj[permission]);
  }
}
