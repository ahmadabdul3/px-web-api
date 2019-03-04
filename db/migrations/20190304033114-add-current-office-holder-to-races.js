'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'races',
      'currentOfficeHolder',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'officeHolderTerms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'races',
      'currentOfficeHolder'
    );
  }
};
