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
        queryInterface.removeConstraint('banners', 'banners_sort_order_key', { transaction }),
        queryInterface.removeConstraint('sub_banners', 'sub_banners_sort_order_key', { transaction }),
        queryInterface.removeConstraint('entertainments', 'entertainments_sort_order_key', { transaction }),
        queryInterface.removeConstraint('promotions', 'promotions_sort_order_key', { transaction }),
        queryInterface.removeConstraint('placements', 'placements_sort_order_key', { transaction }),
      ]);
      await Promise.all([
        queryInterface.sequelize.query('ALTER TABLE sub_banners ADD CONSTRAINT sub_banners_sort_order_key UNIQUE (sort_order) DEFERRABLE INITIALLY IMMEDIATE', { transaction }),
        queryInterface.sequelize.query('ALTER TABLE banners ADD CONSTRAINT banners_sort_order_key UNIQUE (sort_order) DEFERRABLE INITIALLY IMMEDIATE', { transaction }),
        queryInterface.sequelize.query('ALTER TABLE entertainments ADD CONSTRAINT entertainments_sort_order_key UNIQUE (sort_order) DEFERRABLE INITIALLY IMMEDIATE', { transaction }),
        queryInterface.sequelize.query('ALTER TABLE placements ADD CONSTRAINT placements_sort_order_key UNIQUE (sort_order) DEFERRABLE INITIALLY IMMEDIATE', { transaction }),
        queryInterface.sequelize.query('ALTER TABLE promotions ADD CONSTRAINT promotions_sort_order_key UNIQUE (sort_order) DEFERRABLE INITIALLY IMMEDIATE', { transaction }),
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
        queryInterface.removeConstraint('banners', 'banners_sort_order_key', { transaction }),
        queryInterface.removeConstraint('sub_banners', 'sub_banners_sort_order_key', { transaction }),
        queryInterface.removeConstraint('entertainments', 'entertainments_sort_order_key', { transaction }),
        queryInterface.removeConstraint('promotions', 'promotions_sort_order_key', { transaction }),
        queryInterface.removeConstraint('placements', 'placements_sort_order_key', { transaction }),
      ]);
      await Promise.all([
        queryInterface.changeColumn('banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true,
        }, { transaction }),
        queryInterface.changeColumn('entertainments', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true,
        }, { transaction }),
        queryInterface.changeColumn('placements', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true,
        }, { transaction }),
        queryInterface.changeColumn('promotions', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true,
        }, { transaction }),
        queryInterface.changeColumn('sub_banners', 'sort_order', {
          type: Sequelize.INTEGER,
          unique: true,
        }, { transaction }),
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
