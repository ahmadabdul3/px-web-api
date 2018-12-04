'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'officeHolderTerms', // name of Source model
      'politicianId', // name of the key we're adding
      {
        type: Sequelize.UUID,
        references: {
          model: 'politicians', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'officeHolderTerms', // name of Source model
      'politicianId' // key we want to remove
    );
  }
};
