'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('messages', {
      message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      promotion_id: {
        type: Sequelize.UUID,
        references: {
          model: 'promotions',
          key: 'promotion_id',
        },
        onDelete: 'SET NULL',
      },
      pl: {
        type: Sequelize.JSON,
      },
      en: {
        type: Sequelize.JSON,
      },
      uk: {
        type: Sequelize.JSON,
      },
      send_to_all: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      included_excluded_users: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        default: [],
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      date_from: {
        type: Sequelize.DATE,
      },
      date_till: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
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
    await queryInterface.dropTable('messages');
  }
};
