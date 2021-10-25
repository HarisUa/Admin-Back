import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BeforeDestroy } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

import { PromotionTranslationDataInterface } from '../interfaces';

@Table({ comment: 'to store promotions details', tableName: 'promotions', underscored: true, paranoid: true })
export class PromotionModel extends Model<PromotionModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  promotionId: string;

  @Column
  promotionName: string;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @Column({ type: DataType.INTEGER, unique: true })
  sortOrder: number;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.JSON })
  pl: Partial<PromotionTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<PromotionTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<PromotionTranslationDataInterface>;

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

  @BeforeDestroy
  static prepareForDelete(promotion: PromotionModel) {
    promotion.set('sortOrder', null);
  }
}
