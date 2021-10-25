import { Model, Transaction } from 'sequelize';

export async function redorderRecords(oldNumber: number, newNumber: number, model: typeof Model, transaction: Transaction, constrainName?: string) {
  if (newNumber === oldNumber) {
    return;
  }
  await Promise.all([
    model.sequelize.query(`LOCK TABLE ${model.tableName} IN SHARE MODE`, { transaction }),
    model.sequelize.query(`SET CONSTRAINTS ${constrainName || `${model.tableName}_sort_order_key`} DEFERRED`, { transaction }),
  ]);
  if (!newNumber) {
    await model.sequelize.query(
      `UPDATE ${model.tableName} SET sort_order=sort_order-1 WHERE sort_order > ${oldNumber} AND is_active=true AND deleted_at IS NULL`,
      { transaction },
    );
  }
  if (newNumber < oldNumber) {
    await model.sequelize.query(
      `UPDATE ${model.tableName} SET sort_order=sort_order+1 WHERE sort_order < ${oldNumber} AND sort_order >= ${newNumber} AND is_active=true AND deleted_at IS NULL`,
      { transaction },
    );
  }
  if (newNumber > oldNumber) {
    await model.sequelize.query(
      `UPDATE ${model.tableName} SET sort_order=sort_order-1 WHERE sort_order > ${oldNumber} AND sort_order <= ${newNumber} AND is_active=true AND deleted_at IS NULL`,
      { transaction },
    );
  }
}
