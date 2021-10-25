import { Column, DataType, Model, Table, BelongsToMany, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {
  Association,
  BuildOptions,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Optional,
} from 'sequelize';

import { RoleModel } from './role.model';
import { UserRoleModel } from './user-role.model';

import { PermissionsValues } from '@common';

// These are all the attributes in the User model
export interface UserAttributes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export type UserCreationAttributes = Optional<UserAttributes, 'userId' | 'isActive'>;

const definedScopes = {
  WITH_ACTIVE_ROLES_SHORT: 'withActiveRolesShort',
};

@Scopes(() => ({
  [definedScopes.WITH_ACTIVE_ROLES_SHORT]: {
    include: [
      {
        model: RoleModel,
        attributes: ['roleName', 'roleId', 'permissions', 'allPermissions'],
        where: { isActive: true },
        through: { attributes: [] },
      },
    ],
    attributes: { exclude: ['password'] },
  },
}))
@Table({ comment: 'to store user details', tableName: 'users', underscored: true, paranoid: true })
export class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  /**
   * Creates an instance of UserModel.
   * @param {UserModel} [values]
   * @param {BuildOptions} [options]
   */
  constructor(values?: UserModel, options?: BuildOptions) {
    super(values, options);

    this._rolesNames = this.roles?.map((role) => role.roleName) || [];
    this._permissions = [...new Set(this.roles?.map((role) => role.permissions).flat())] || [];
    this._allPermissions = this.roles?.some((role) => role.allPermissions);
    this._permissionsObj = this._permissions.reduce((permissionObj, permission) => {
      permissionObj[permission] = true;
      return permissionObj;
    }, {} as Record<PermissionsValues, true>);
  }

  /**
   * All perdefined scopes for this model
   * @static
   */
  public static definedScopes = definedScopes;

  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  userId: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => UserModel)
  createdBy: string;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => UserModel)
  updatedBy: string;

  @BelongsTo(() => UserModel, 'createdBy')
  createdByUser?: UserModel;

  @BelongsTo(() => UserModel, 'updatedBy')
  updatedByUser?: UserModel;

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  roles: RoleModel[];

  public getRoles: HasManyGetAssociationsMixin<RoleModel>;
  public addRole: HasManyAddAssociationMixin<RoleModel, number>;
  public hasRole: HasManyHasAssociationMixin<RoleModel, number>;
  public countRole: HasManyCountAssociationsMixin;
  public createRole: HasManyCreateAssociationMixin<RoleModel>;

  public static associations: {
    roles: Association<UserModel, RoleModel>;
  };

  /**
   * To get all permission have by this user
   * @readonly
   * @type {string[]}
   */
  get permissions(): string[] {
    return this._permissions;
  }

  /**
   * To get permissions in object form
   * @readonly
   * @type {Record<PermissionsValues, true>}
   */
  get permissionsObj(): Record<PermissionsValues, true> {
    return this._permissionsObj;
  }

  /**
   * get all roles names have by this user
   * @readonly
   * @type {string[]}
   */
  get rolesNames(): string[] {
    return this._rolesNames;
  }

  /**
   * To whether user have all permisssions or not
   * @readonly
   * @type {boolean}
   */
  get allPermissions(): boolean {
    return this._allPermissions;
  }

  /**
   * To store roles names
   * @private
   * @type {string[]}
   */
  private _rolesNames: string[];

  /**
   * To store permissions
   * @private
   * @type {string[]}
   */
  private _permissions: string[];

  /**
   * To store permissions in object form
   * @private
   * @type {Record<PermissionsValues, true>}
   */
  private _permissionsObj: Record<PermissionsValues, true>;

  /**
   * To decide whether user have all permissions or not
   * @private
   * @type {boolean}
   */
  private _allPermissions: boolean = false;
}
