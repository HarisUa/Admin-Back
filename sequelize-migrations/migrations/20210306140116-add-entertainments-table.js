'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('entertainments', {
      entertainment_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('gen_random_uuid'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sub_title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      date_from: {
        type: Sequelize.DATE,
      },
      date_till: {
        type: Sequelize.DATE,
      },
      event_game_id: {
        type: Sequelize.STRING,
      },
      sort_order: {
        type: Sequelize.INTEGER,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      image_url: { type: Sequelize.TEXT },
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('entertainments');
  },
};
