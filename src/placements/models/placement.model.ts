import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BeforeDestroy } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

@Table({ comment: 'to store placements details', tableName: 'placements', underscored: true, paranoid: true })
export class PlacementModel extends Model<PlacementModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  placementId: string;

  @Column
  placementName: string;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  screens: string[];

  @Column({ type: DataType.INTEGER, unique: true })
  sortOrder: number;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.JSON })
  pl: Partial<PlacementTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<PlacementTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<PlacementTranslationDataInterface>;

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
  static prepareForDelete(placement: PlacementModel) {
    placement.set('sortOrder', null);
  }
}

/**
 * Translation data interface for placement
 * @export
 * @interface PlacementTranslationDataInterface
 */
export interface PlacementTranslationDataInterface {
  title: string;
  subTitle: string;
  link: string;
  imageUrl: string;
  imageAltText: string;
}
