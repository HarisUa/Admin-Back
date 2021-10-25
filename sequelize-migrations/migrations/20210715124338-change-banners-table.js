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
        await queryInterface.removeColumn('banners', 'title', { transaction }),
        await queryInterface.removeColumn('banners', 'sub_title', { transaction }),
        await queryInterface.removeColumn('banners', 'link', { transaction }),
        await queryInterface.removeColumn('banners', 'image_url', { transaction }),
        await queryInterface.addColumn('banners', 'en', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('banners', 'pl', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('banners', 'uk', {
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
