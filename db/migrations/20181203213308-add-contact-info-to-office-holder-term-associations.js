'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'contactInfos', // name of Source model
      'officeHolderTermId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'officeHolderTerms', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'contactInfos', // name of Source model
      'officeHolderTermId' // key we want to remove
    );
  }
};
