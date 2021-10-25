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
      await queryInterface.addColumn('banners', 'event_id', { type: Sequelize.STRING }, { transaction });
      await queryInterface.addColumn(
        'banners',
        'event_game_type',
        {
          type: Sequelize.INTEGER,
        },
        { transaction },
      );
      await queryInterface.addColumn('entertainments', 'event_id', { type: Sequelize.STRING }, { transaction });
      await queryInterface.addColumn(
        'entertainments',
        'event_game_type',
        {
          type: Sequelize.INTEGER,
        },
        { transaction },
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
      await queryInterface.removeColumn('banners', 'event_id', { transaction });
      await queryInterface.removeColumn('banners', 'event_game_type', { transaction });

      await queryInterface.removeColumn('entertainments', 'event_id', { transaction });
      await queryInterface.removeColumn('entertainments', 'event_game_type', { transaction });
    });
  },
};
