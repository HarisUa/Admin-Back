'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('banners', 'image_url', { type: Sequelize.TEXT }),
      queryInterface.addColumn('banners', 'deleted_at', { type: Sequelize.DATE }),
    ]);
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([queryInterface.removeColumn('banners', 'image_url'), queryInterface.removeColumn('banners', 'deleted_at')]);
  },
};
