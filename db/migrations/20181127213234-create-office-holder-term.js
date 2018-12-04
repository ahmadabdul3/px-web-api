'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('officeHolderTerms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      party: {
        type: Sequelize.TEXT
      },
      titlePrimary: {
        type: Sequelize.TEXT
      },
      titleSecondary: {
        type: Sequelize.TEXT
      },
      levelOfResponsibility: {
        type: Sequelize.TEXT
      },
      areaOfResponsibility: {
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
    return queryInterface.dropTable('officeHolderTerms');
  }
};
