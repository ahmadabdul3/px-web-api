'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'candidateTerms',
      'raceId',
       Sequelize.INTEGER,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'candidateTerms',
      'raceId',
    );
  }
};
