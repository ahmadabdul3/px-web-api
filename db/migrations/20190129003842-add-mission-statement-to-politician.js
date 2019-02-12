'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'politicians', // name of Source model
      'missionStatement', // name of the key we're adding
       Sequelize.TEXT,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'politicians', // name of Source model
      'missionStatement', // name of the key we're adding
    );
  }
};
