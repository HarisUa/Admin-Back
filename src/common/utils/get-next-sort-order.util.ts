import { Model, ModelCtor } from 'sequelize-typescript';

/**
 * To get next sort order of given model table
 * @export
 * @template T
 * @param {ModelCtor<T>} model sequelize model
 * @param {keyof T} [sortOrderKey='sortOrder' as keyof T['_attributes']] key to find sort order
 * @returns {Promise<number>} next sort order of given model table
 */
export async function getNextSortOrder<T extends Model>(model: ModelCtor<T>, sortOrderKey = 'sortOrder' as keyof T['_attributes']): Promise<number> {
  const maxSortOrder: number = await model.max(sortOrderKey);
  if (!maxSortOrder || typeof maxSortOrder !== 'number') {
    return 1;
  }
  return maxSortOrder + 1;
}
