import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { UserModel } from '@shared/models';
// import { PromotionModel } from '@src/promotions/model/promotion.model';

// import { MessageTranslationDataInterface } from '../interfaces';

@Table({ comment: 'to store messages details', tableName: 'mybet', underscored: true, paranoid: true })
export class MybetModel extends Model<MybetModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  mybetId: string;

  // @Column({ type: DataType.STRING })
  // mybetName: string;

  // @ForeignKey(() => PromotionModel)
  // @Column({ type: DataType.UUID })
  // promotionId: string;

  // @Column({ type: DataType.JSON })
  // pl: Partial<MessageTranslationDataInterface>;

  // @Column({ type: DataType.JSON })
  // en: Partial<MessageTranslationDataInterface>;

  // @Column({ type: DataType.JSON })
  // uk: Partial<MessageTranslationDataInterface>;

  // @Column({ type: DataType.BOOLEAN })
  // sendToAll: boolean;

  // @Column({ type: DataType.ARRAY(DataType.STRING) })
  // includedExcludedUsers: string[];

  @Column({ type: DataType.STRING })
  mybetEmail: string;

  @Column({ type: DataType.STRING })
  mybetDescription: string;

  @Column({ type: DataType.STRING })
  mybetAction: string;

  @Column({ defaultValue: true })
  mybetStatus: boolean;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  // @ForeignKey(() => UserModel)
  // @Column
  // createdBy: string;

  @ForeignKey(() => UserModel)
  @Column
  modifiedBy: string;

  // @BelongsTo(() => UserModel)
  // createdByUser: UserModel;

  // @BelongsTo(() => UserModel)
  // updatedByUser: UserModel;
}
