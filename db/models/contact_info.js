'use strict';
module.exports = (sequelize, DataTypes) => {
  const contactInfo = sequelize.define('contactInfo', {
    email: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    streetAddress: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    zipCode: DataTypes.TEXT
  }, {});
  
  contactInfo.associate = function(models) {
    contactInfo.belongsTo(models.politician);
    contactInfo.belongsTo(models.officeHolderTerm);
  };

  return contactInfo;
};
