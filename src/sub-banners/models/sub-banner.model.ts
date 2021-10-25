import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BeforeDestroy } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

@Table({ comment: 'to store sub-banners details', tableName: 'sub_banners', underscored: true, paranoid: true })
export class SubBannerModel extends Model<SubBannerModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  subBannerId: string;

  @Column
  subBannerName: string;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @Column({ type: DataType.INTEGER, unique: true })
  sortOrder: number;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.JSON })
  pl: Partial<SubBannerTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<SubBannerTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<SubBannerTranslationDataInterface>;

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
  static prepareForDelete(subBanner: SubBannerModel) {
    subBanner.set('sortOrder', null);
  }
}

/**
 * Interface for translation details for sub-banners
 * @export
 * @interface SubBannerTranslationDataInterface
 */
export interface SubBannerTranslationDataInterface {
  title: string;
  link: string;
  imageUrl: string;
  imageAltText: string;
}
