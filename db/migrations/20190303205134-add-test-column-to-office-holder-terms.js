'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'officeHolderTerms',
      'testData',
       Sequelize.BOOLEAN,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'officeHolderTerms',
      'testData'
    );
  }
};
