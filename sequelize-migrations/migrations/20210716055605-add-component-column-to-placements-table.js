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
      await queryInterface.bulkDelete('placements', {}, { truncate: true, cascade: true, transaction });
      await queryInterface.addColumn('placements', 'components', { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false }, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('placements', 'components');
  }
};
