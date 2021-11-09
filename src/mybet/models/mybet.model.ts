import { Column, DataType, Model, Table, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';

import { UserModel } from '@shared/models';
// import { PromotionModel } from '@src/promotions/model/promotion.model';

// import { MessageTranslationDataInterface } from '../interfaces';

@Table({ comment: 'to store messages details', tableName: 'mybet', underscored: true, paranoid: true })
export class MybetModel extends Model<MybetModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  mybetId: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ defaultValue: true })
  isActive: boolean;
  
  @Column({ type: DataType.DATE })
  dateAdded: Date;

  @Column({ type: DataType.DATE })
  dateEvent: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @ForeignKey(() => UserModel)
  @Column
  updatedBy: string;

  @BelongsTo(() => UserModel)
  createdByUser: UserModel;

  @BelongsTo(() => UserModel)
  updatedByUser: UserModel;
}
