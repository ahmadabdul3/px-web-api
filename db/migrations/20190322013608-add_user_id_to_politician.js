'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'politicians', // name of Source model
      'userId', // name of the key we're adding
      {
        type: Sequelize.UUID,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'politicians', // name of Source model
      'userId' // key we want to remove
    );
  }
};
