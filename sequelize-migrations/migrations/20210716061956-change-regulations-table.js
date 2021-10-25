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
      await Promise.all([
        await queryInterface.removeColumn('regulations', 'regulation_title', { transaction }),
        await queryInterface.removeColumn('regulations', 'regulation_file_url', { transaction }),
        await queryInterface.addColumn('regulations', 'regulation_name', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        await queryInterface.addColumn('regulations', 'type', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        await queryInterface.addColumn('regulations', 'en', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('regulations', 'pl', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('regulations', 'uk', { 
          type: Sequelize.JSON,
        }, { transaction }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    throw 'can not go back from this point'
  }
};
