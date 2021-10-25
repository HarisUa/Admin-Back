import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { RoleModel } from './role.model';
import { UserModel } from './user.model';

// These are all the attributes in the user role model
export interface UserRoleAttributes {
  userId: string;
  roleId: number;
  userRoleId: string;
}

export type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'userRoleId'>;

@Table({ comment: 'to define users roles', tableName: 'users_roles', underscored: true })
export class UserRoleModel extends Model<UserRoleAttributes, UserRoleCreationAttributes> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  userRoleId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => RoleModel)
  roleId: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  @ForeignKey(() => UserModel)
  userId: string;
}
