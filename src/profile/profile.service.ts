import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UserModel } from '@shared/models';
import { CognitoService } from '@shared/modules';

/**
 * To server request from ProfileController
 * @export
 * @class ProfileService
 */
@Injectable()
export class ProfileService {
  /**
   * Creates an instance of ProfileService.
   * @param {typeof UserModel} userModel sequelize user model
   */
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly cognitoServicer: CognitoService,
  ) {}

  /**
   * To get user profile
   * @param {UserModel} loggedInUser logged in user model
   * @return user profile
   */
  async getProfile(loggedInUser: UserModel) {
    // get all users permissions
    const userPermissions = loggedInUser.permissions.reduce((permissionObj, permission) => {
      permissionObj[permission] = true;
      return permissionObj;
    }, {});

    // user roles
    const userRoles = loggedInUser.rolesNames;

    // whetehr user have all permissions or not
    const allPermissions = loggedInUser.allPermissions;

    const userProfile = { permissions: userPermissions, ...loggedInUser.get(), allPermissions, roles: userRoles };

    return userProfile;
  }

  /**
   * To get temporary credentials of aws for user
   * @param {string} userId user id to use for authorization
   * @return aws temp credentials
   */
  async getAwsTempCredentials(userId: string) {
    const tempCredentials = await this.cognitoServicer.getTempCredentials(userId);
    return tempCredentials;
  }
}
