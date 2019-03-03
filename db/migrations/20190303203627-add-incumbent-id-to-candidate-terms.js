'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'candidateTerms',
      'incumbentId',
       Sequelize.INTEGER,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'candidateTerms',
      'incumbentId',
    );
  }
};
