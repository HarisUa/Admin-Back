'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all(
        [
          queryInterface.renameColumn('placements', 'components', 'screens', { transaction }),
          queryInterface.removeColumn('placements', 'places', { transaction }),
        ]
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all(
        [
          queryInterface.renameColumn('placements', 'screens', 'components', { transaction }),
          queryInterface.addColumn('placements', 'places', {
            type: Sequelize.ARRAY(Sequelize.STRING),
          }, { transaction })
        ]
      );
    });
  }
};
