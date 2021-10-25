'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('mybet', {
      mybet_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mybet_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mybet_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mybet_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      mybet_action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modified_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      mybet_comments: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      modified_at: {
        type: Sequelize.DATE, 
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('mybet');
  }
};




