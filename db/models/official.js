'use strict';

const official = (sequelize, DataTypes) => {
  const official = sequelize.define('official', {
    firstName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    middleName: DataTypes.TEXT,
    email: DataTypes.TEXT,
    suffix: DataTypes.TEXT,
    party: DataTypes.TEXT,
    titlePrimary: DataTypes.TEXT,
    titleSecondary: DataTypes.TEXT,
    levelOfResponsibility: DataTypes.TEXT,
    areaOfResponsibility: DataTypes.TEXT,
    streetAddress: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    zipCode: DataTypes.TEXT,
    phone: DataTypes.TEXT,
  }, {
    // underscored: false,
  });

  official.associate = function(models) {

  };

  return official;
};

export default official;
