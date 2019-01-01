'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('committeeTerms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      politicianId: {
        type: Sequelize.UUID,
        references: {
          model: 'politicians',
          key: 'id',
        },
      },
      officeHolderTermId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'officeHolderTerms',
          key: 'id',
        },
      },
      committeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'committees',
          key: 'id',
        },
      },
      title: {
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
    return queryInterface.dropTable('committeeTerms');
  }
};
