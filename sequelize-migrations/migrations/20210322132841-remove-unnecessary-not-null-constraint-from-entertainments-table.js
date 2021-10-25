'use strict';

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query('ALTER TABLE banners ALTER COLUMN title DROP NOT NULL', { transaction: t }),
        queryInterface.sequelize.query('ALTER TABLE banners ALTER COLUMN link DROP NOT NULL', { transaction: t }),
        queryInterface.sequelize.query('ALTER TABLE sub_banners ALTER COLUMN image_url DROP NOT NULL', { transaction: t }),
        queryInterface.sequelize.query('ALTER TABLE placements ALTER COLUMN image_url DROP NOT NULL', { transaction: t }),
        queryInterface.sequelize.query('ALTER TABLE entertainments ALTER COLUMN title DROP NOT NULL', { transaction: t }),
      ]);
    });
  },

  down: async () => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    throw new Error('From this point no return');
  },
};
