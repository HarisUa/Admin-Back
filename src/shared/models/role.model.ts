import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserRoleModel } from './user-role.model';

import { UserModel } from './user.model';

@Table({ comment: 'to store roles and permissions details', tableName: 'roles', underscored: true, paranoid: true })
export class RoleModel extends Model<RoleModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  roleId: number;

  @Column
  roleName: string;

  @Column({ unique: true })
  roleDescription: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  permissions: string[];

  @Column({ defaultValue: false })
  allPermissions: boolean;

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

  @BelongsToMany(() => UserModel, () => UserRoleModel)
  users?: UserModel[];
}
