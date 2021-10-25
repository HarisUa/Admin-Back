'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'created_by',
          {
            type: Sequelize.BIGINT,
            references: {
              model: 'users',
              key: 'user_id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'users',
          'updated_by',
          {
            type: Sequelize.BIGINT,
            references: {
              model: 'users',
              key: 'user_id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('users', 'created_by', { transaction: t }),
        queryInterface.removeColumn('users', 'updated_by', { transaction: t }),
      ]);
    });
  },
};
