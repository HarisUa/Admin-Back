import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';

import { RoleModel, UserModel, UserRoleModel } from '@shared/models';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * To serve request from RoleController
 * @export
 * @class RolesService
 */
@Injectable()
export class RolesService {
  /**
   * Creates an instance of RolesService.
   * @param {typeof RoleModel} roleModel sequelize role model
   */
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
  ) {}

  /**
   * To create role
   * @param {CreateRoleDto} createRoleDto create request body
   * @param {UserModel} loggedInUser user details
   * @return created role
   */
  async create(createRoleDto: CreateRoleDto, loggedInUser: UserModel) {
    // do not allow user to create role with permissions which user don't have
    if (
      !loggedInUser.allPermissions &&
      (createRoleDto.allPermissions || !createRoleDto.permissions.every((permission) => loggedInUser.permissionsObj[permission]))
    ) {
      throw new UnprocessableEntityException('you can assign permission only which you have to this role');
    }

    // check role with given name exist or not
    let role = await this.roleModel.findOne({
      where: { roleName: createRoleDto.roleName },
      attributes: ['roleId', 'deletedAt'],
      paranoid: false,
    });
    if (role && !role.isSoftDeleted()) {
      throw new UnprocessableEntityException('role with given name already exist');
    }

    return await this.roleModel.sequelize.transaction(async (transaction) => {
      if (role) {
        await role.restore({ transaction });
      }

      if (!role) {
        role = this.roleModel.build();
      }

      role.set(createRoleDto);
      role.set('createdBy', loggedInUser.userId);
      role.set('updatedBy', loggedInUser.userId);

      // create role
      await role.save({ transaction });

      return role.get({ plain: true });
    });
  }

  /**
   * to get all roles
   * @return get all roles
   */
  async findAll() {
    const roles = await this.roleModel.findAll();
    return roles.map((r) => r.get({ plain: true }));
  }

  /**
   * To get one specific role
   * @param {number} roleId role id
   * @return role details
   */
  async findOne(roleId: number) {
    const roleModel = await this.roleModel.findByPk(roleId);

    // role not exist
    if (!roleModel) {
      throw new UnprocessableEntityException('role does not exist');
    }
    return roleModel.get({ plain: true });
  }

  /**
   * To update role
   * @param {number} id id of role
   * @param {UpdateRoleDto} updateRoleDto request body
   * @param {UserModel} loggedInUser user details
   * @return updated role
   */
  async update(id: number, updateRoleDto: UpdateRoleDto, loggedInUser: UserModel) {
    try {
      // start transaction
      return await this.roleModel.sequelize.transaction(async (transaction) => {
        // find role model
        const roleModel = await this.roleModel.findByPk(id, { transaction });

        // role model not exist
        if (!roleModel) {
          throw new UnprocessableEntityException('role does not exist');
        }

        // do not allow user to create role with permissions which user don't have
        if (
          !loggedInUser.allPermissions &&
          (roleModel.allPermissions || !roleModel.permissions.every((permission) => loggedInUser.permissionsObj[permission]))
        ) {
          throw new UnprocessableEntityException('you can assign permissions only which you have to this role');
        }
        // set properties
        roleModel.set(updateRoleDto);
        roleModel.set('updatedBy', loggedInUser.userId);

        // save to database
        await roleModel.save({ transaction });
        return roleModel.get({ plain: true });
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new UnprocessableEntityException('role with given name already exist');
      }
      throw error;
    }
  }

  /**
   * To delete role
   * @param {number} roleId role id
   */
  async delete(roleId: number) {
    const role = await this.roleModel.findByPk(roleId);

    // role model not exist
    if (!role) {
      throw new UnprocessableEntityException('role does not exist');
    }

    // delete user and its relations
    await this.roleModel.sequelize.transaction((transaction) =>
      Promise.all([this.userRoleModel.destroy({ where: { roleId }, transaction }), role.destroy({ transaction })]),
    );
  }

  /**
   * To get roles in dropdown
   * @return roles in dropdown
   */
  async rolesDropdown() {
    const roles = await this.roleModel.findAll({ where: { isActive: true } });

    return roles.map((role) => ({ roleId: role.roleId, roleName: role.roleName }));
  }
}
