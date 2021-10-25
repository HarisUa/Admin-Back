import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { UserModel } from '@shared/models';

@Table({ comment: 'to store regulation details', tableName: 'regulations', underscored: true, paranoid: true })
export class RegulationModel extends Model<RegulationModel> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  regulationId: string;

  @Column
  regulationName: string;

  @Column
  type: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.JSON })
  pl: Partial<RegulationTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  en: Partial<RegulationTranslationDataInterface>;

  @Column({ type: DataType.JSON })
  uk: Partial<RegulationTranslationDataInterface>;

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

/**
 * Translation data for regulation
 * @export
 * @interface RegulationTranslationDataInterface
 */
export interface RegulationTranslationDataInterface {
  title: string;
  fileUrl: string;
}
