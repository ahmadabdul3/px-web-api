'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('officials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.TEXT
      },
      lastName: {
        type: Sequelize.TEXT
      },
      middleName: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      suffix: {
        type: Sequelize.TEXT
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
      streetAddress: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.TEXT
      },
      state: {
        type: Sequelize.TEXT
      },
      zipCode: {
        type: Sequelize.TEXT
      },
      phone: {
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
    return queryInterface.dropTable('officials');
  }
};
