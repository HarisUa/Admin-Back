'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.changeColumn('banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true
        }, { transaction }),
        queryInterface.changeColumn('entertainments', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true
        }, { transaction }),
        queryInterface.changeColumn('placements', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true
        }, { transaction }),
        queryInterface.changeColumn('promotions', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true
        }, { transaction }),
        queryInterface.changeColumn('sub_banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true
        }, { transaction }),
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await Promise.all([
        queryInterface.changeColumn('banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: false
        }, { transaction }),
        queryInterface.changeColumn('entertainments', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: false
        }, { transaction }),
        queryInterface.changeColumn('placements', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: false
        }, { transaction }),
        queryInterface.changeColumn('promotions', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: false
        }, { transaction }),
        queryInterface.changeColumn('sub_banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: false
        }, { transaction }),
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
