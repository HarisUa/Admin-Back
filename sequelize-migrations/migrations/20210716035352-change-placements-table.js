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
        await queryInterface.removeColumn('placements', 'title', { transaction }),
        await queryInterface.removeColumn('placements', 'sub_title', { transaction }),
        await queryInterface.removeColumn('placements', 'link', { transaction }),
        await queryInterface.removeColumn('placements', 'image_url', { transaction }),
        await queryInterface.addColumn('placements', 'placement_name', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        await queryInterface.addColumn('placements', 'en', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('placements', 'pl', {
          type: Sequelize.JSON,
        }, { transaction }),
        await queryInterface.addColumn('placements', 'uk', {
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
