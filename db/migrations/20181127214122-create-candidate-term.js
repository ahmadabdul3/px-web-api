'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candidateTerms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      positionRunningFor: {
        type: Sequelize.TEXT
      },
      positionCurrentOfficeHolder: {
        type: Sequelize.BOOLEAN
      },
      electionResult: {
        type: Sequelize.TEXT
      },
      runningUnderParty: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('candidateTerms');
  }
};
