import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError, Op } from 'sequelize';
import { difference, pick } from 'lodash';
import md5 from 'md5';

import { RoleModel, UserModel, UserRoleModel } from '@shared/models';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserFiltersDto } from './dto/find-user-filters.dto';
import { UserMapper } from './user.mapper';

/**
 * To serve request from UsersController
 * @export
 * @class UsersService
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   * @param {typeof UserModel} userModel sequelize users model
   * @param {typeof RoleModel} roleModel sequelize roles model
   */
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * To create user
   * @param {CreateUserDto} createUserDto create user request
   * @param {UserModel} loggedInUser current user
   */
  async create(createUserDto: CreateUserDto, loggedInUser: UserModel) {
    // generate md5 hash of password
    createUserDto.password = md5(createUserDto.password);

    // validate user and roles
    const [userExist, foundedRoles] = await Promise.all([
      this.userModel.findOne({ where: { email: createUserDto.email }, attributes: ['userId', 'deletedAt'], paranoid: false }),
      this.roleModel.count({ where: { roleId: { [Op.in]: createUserDto.rolesIds }, isActive: true } }),
    ]);

    // user exist
    if (userExist && !userExist.isSoftDeleted()) {
      throw new UnprocessableEntityException('user with given email already exist');
    }

    // check whether given roles exist or not
    if (foundedRoles !== createUserDto.rolesIds.length) {
      throw new UnprocessableEntityException('one of given role is not exist');
    }

    try {
      await this.userModel.sequelize.transaction(async (transaction) => {
        // to upsert user if soft deleted
        let user: UserModel;
        if (userExist) {
          await userExist.restore({ transaction });
        }
        user = userExist;

        // create user
        if (!user) {
          user = this.userModel.build();
        }

        // set user
        user.set({
          ...pick(createUserDto, ['firstName', 'lastName', 'password', 'email']),
          updatedBy: loggedInUser.userId,
          createdBy: loggedInUser.userId,
        });
        user.deletedAt = null;

        await user.save({ transaction });

        // map users with given roles
        await this.userRoleModel.bulkCreate(
          createUserDto.rolesIds.map((roleId) => ({ roleId, userId: user.userId })),
          { transaction },
        );
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError && error.fields['email']) {
        throw new UnprocessableEntityException('user with given email already exist');
      }
      throw error;
    }
  }

  /**
   * To find users based on filters
   * @param {FindUserFiltersDto} queryParams query params filters
   * @return users list
   */
  async findAll(queryParams: FindUserFiltersDto) {
    // define limit and offset
    const { limit, offset } = queryParams.getPaginationInfo(10);

    // get users and total users count
    const [users, totalUsers] = await Promise.all([
      this.userModel.scope(this.userModel.definedScopes.WITH_ACTIVE_ROLES_SHORT).findAll({ offset, limit }),
      this.userModel.count(),
    ]);

    const mappedUsers = users.map(this.userMapper.mapUserDetails.bind(this.userMapper));

    return { users: mappedUsers, totalUsers };
  }

  /**
   * To find one user
   * @param {string} userId user id to use
   * @return user details
   */
  async findOne(userId: string) {
    const user = await this.userModel.scope(this.userModel.definedScopes.WITH_ACTIVE_ROLES_SHORT).findByPk(userId);

    // throw error if not found
    if (!user) {
      throw new UnprocessableEntityException('user with given id not found');
    }
    return this.userMapper.mapUserDetails(user);
  }

  /**
   * To update user details and roles
   * @param {string} userId user id
   * @param {UpdateUserDto} updateUserDto update details
   * @param {UserModel} loggedInUser current user
   * @return updated user details
   */
  async update(userId: string, updateUserDto: UpdateUserDto, loggedInUser: UserModel) {
    const user = await this.userModel.scope(this.userModel.definedScopes.WITH_ACTIVE_ROLES_SHORT).findByPk(userId);

    // throw error if not found
    if (!user) {
      throw new UnprocessableEntityException('user with given id not found');
    }

    let rolesToAdd: number[];
    let rolesToRemove: number[];

    if (updateUserDto.rolesIds) {
      rolesToAdd = difference(
        updateUserDto.rolesIds,
        user.roles.map((r) => r.roleId),
      );
      rolesToRemove = difference(
        user.roles.map((r) => r.roleId),
        updateUserDto.rolesIds,
      );
    }
    const rolesChangePromise = [];
    return await this.userModel.sequelize.transaction(async (transaction) => {
      // add roles to user
      if (rolesToAdd) {
        rolesChangePromise.push(
          this.userRoleModel.bulkCreate(
            rolesToAdd.map((roleId) => ({ userId: user.userId, roleId })),
            { transaction },
          ),
        );
      }
      // remove roles from user
      if (rolesToRemove) {
        rolesChangePromise.push(
          ...rolesToRemove.map((roleId) => this.userRoleModel.destroy({ where: { userId: user.userId, roleId }, transaction })),
        );
      }
      await Promise.all(rolesChangePromise);

      // save user details
      user.set(pick(updateUserDto, ['firstName', 'lastName', 'email', 'isActive']));
      user.set('updatedBy', loggedInUser.userId);
      await user.save({ transaction });

      // fetch latest update user details
      const updatedUser = await this.userModel.scope(this.userModel.definedScopes.WITH_ACTIVE_ROLES_SHORT).findByPk(userId);

      return this.userMapper.mapUserDetails(updatedUser);
    });
  }

  /**
   * To delete user
   * @param {string} userId user to delete
   */
  async delete(userId: string) {
    const user = await this.userModel.findByPk(userId);

    // throw error if not found
    if (!user) {
      throw new UnprocessableEntityException('user with given id not found');
    }

    // delete user and their relations
    await this.userModel.sequelize.transaction((transaction) =>
      Promise.all([this.userRoleModel.destroy({ where: { userId }, transaction }), user.destroy({ transaction })]),
    );
  }
}
