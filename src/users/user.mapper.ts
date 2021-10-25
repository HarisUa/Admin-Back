import { UserModel } from '@shared/models';

/**
 * to map user related details
 * @export
 * @class UserMapper
 */
export class UserMapper {
  /**
   * to map user details
   * @param {UserModel} user original user details from db
   * @return mapped user details
   */
  mapUserDetails(user: UserModel) {
    const userDetails = user.get({ plain: true });
    const userRoles = user.roles?.map((role) => ({ roleId: role.roleId, roleName: role.roleName })) || [];
    return { ...userDetails, roles: userRoles };
  }
}
