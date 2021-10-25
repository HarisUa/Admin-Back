'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(
      'sport_events',
      {
        event_id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        event_start: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        event_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sport_id: {
          type: Sequelize.INTEGER,
        },
        sport_name: {
          type: Sequelize.TEXT,
        },
        parent_id: {
          type: Sequelize.INTEGER,
        },
        parent_name: {
          type: Sequelize.TEXT,
        },
        category_id: {
          type: Sequelize.INTEGER,
        },
        category_name: {
          type: Sequelize.TEXT,
        },
        twitch_channel: {
          type: Sequelize.STRING,
        },
        is_esport: {
          type: Sequelize.BOOLEAN,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      { comment: 'to store events details from sb betting' },
    );
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('sport_events');
  },
};
