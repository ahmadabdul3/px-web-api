'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addIndex(
      'committeeTerms',
      ['committeeId', 'officeHolderTermId'],
      {
        indexName: 'uniqueCommitteeTerm',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeIndex(
      'committeeTerms',
      ['committeeId', 'officeHolderTermId'],
      {
        indexName: 'uniqueCommitteeTerm',
        indicesType: 'UNIQUE'
      }
    );
  }
};
