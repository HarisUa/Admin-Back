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
        await queryInterface.removeColumn('promotions', 'title', { transaction }),
        await queryInterface.removeColumn('promotions', 'sub_title', { transaction }),
        await queryInterface.removeColumn('promotions', 'link', { transaction }),
        await queryInterface.removeColumn('promotions', 'image_url', { transaction }),
        await queryInterface.removeColumn('promotions', 'description', { transaction }),
        await queryInterface.removeColumn('promotions', 'buttons', { transaction }),
        await queryInterface.addColumn('promotions', 'promotion_name', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        await queryInterface.addColumn('promotions', 'en', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('promotions', 'pl', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('promotions', 'uk', {
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
