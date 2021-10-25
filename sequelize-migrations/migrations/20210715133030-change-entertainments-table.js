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
        await queryInterface.removeColumn('entertainments', 'title', { transaction }),
        await queryInterface.removeColumn('entertainments', 'sub_title', { transaction }),
        await queryInterface.removeColumn('entertainments', 'image_url', { transaction }),
        await queryInterface.addColumn('entertainments', 'entertainment_name', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        await queryInterface.addColumn('entertainments', 'en', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('entertainments', 'pl', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('entertainments', 'uk', {
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
