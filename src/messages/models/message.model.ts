import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { UserModel } from '@shared/models';
import { PromotionModel } from '@src/promotions/model/promotion.model';

import { MessageTranslationDataInterface } from '../interfaces';

@Table({ comment: 'to store messages details', tableName: 'messages', underscored: true, paranoid: true })
export class MessageModel extends Model<MessageModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  messageId: string;

  @Column({ type: DataType.STRING })
  messageName: string;

  @ForeignKey(() => PromotionModel)
  @Column({ type: DataType.UUID })
  promotionId: string;

  @Column({ type: DataType.JSON })
  pl: Partial<MessageTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<MessageTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<MessageTranslationDataInterface>;

  @Column({ type: DataType.BOOLEAN })
  sendToAll: boolean;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  includedExcludedUsers: string[];

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @ForeignKey(() => UserModel)
  @Column
  createdBy: string;

  @ForeignKey(() => UserModel)
  @Column
  updatedBy: string;

  @BelongsTo(() => UserModel)
  createdByUser: UserModel;

  @BelongsTo(() => UserModel)
  updatedByUser: UserModel;
}
