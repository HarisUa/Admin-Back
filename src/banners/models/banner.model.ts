import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BeforeDestroy } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

@Table({ comment: 'to store banners details', tableName: 'banners', underscored: true, paranoid: true })
export class BannerModel extends Model<BannerModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  bannerId: string;

  @Column
  bannerName: string;

  @Column({ type: DataType.JSON })
  en: Partial<BannerTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  pl: Partial<BannerTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<BannerTranslationDataInterface>;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @Column({ type: DataType.INTEGER, unique: true })
  sortOrder: number;

  @Column
  eventGameId: string;

  @Column
  eventId: string;

  @Column(DataType.INTEGER)
  eventGameType: number;

  @Column({ defaultValue: true })
  isActive: boolean;

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
  static prepareForDelete(banner: BannerModel) {
    banner.set('sortOrder', null);
  }
}

/**
 * banner translation structure data
 * @export
 * @interface BannerTranslationDataInterface
 */
export interface BannerTranslationDataInterface {
  title: string;
  subTitle: string;
  link: string;
  imageUrl: string;
  imageAltText: string;
}
