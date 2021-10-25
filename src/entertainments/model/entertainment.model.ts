import { Column, DataType, Model, Table, ForeignKey, BelongsTo, BeforeDestroy } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

@Table({ comment: 'to store entertainments details', tableName: 'entertainments', underscored: true, paranoid: true })
export class EntertainmentModel extends Model<EntertainmentModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.UUID })
  entertainmentId: string;

  @Column
  entertainmentName: string;

  @Column({ type: DataType.DATE })
  dateFrom: Date;

  @Column({ type: DataType.DATE })
  dateTill: Date;

  @Column({ type: DataType.STRING })
  category: string;

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

  @Column({ type: DataType.JSON })
  pl: Partial<EntertainmentTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<EntertainmentTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<EntertainmentTranslationDataInterface>;

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
  static prepareForDelete(entertainment: EntertainmentModel) {
    entertainment.set('sortOrder', null);
  }
}

/**
 * Translation data for entertainment interface
 * @export
 * @interface EntertainmentTranslationDataInterface
 */
export interface EntertainmentTranslationDataInterface {
  title: string;
  subTitle: string;
  imageUrl: string;
  imageAltText: string;
}
