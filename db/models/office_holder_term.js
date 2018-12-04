'use strict';
module.exports = (sequelize, DataTypes) => {
  const officeHolderTerm = sequelize.define('officeHolderTerm', {
    party: DataTypes.TEXT,
    titlePrimary: DataTypes.TEXT,
    titleSecondary: DataTypes.TEXT,
    levelOfResponsibility: DataTypes.TEXT,
    areaOfResponsibility: DataTypes.TEXT
  }, {});
  officeHolderTerm.associate = function(models) {
    officeHolderTerm.belongsTo(models.politician);
    officeHolderTerm.hasMany(models.contactInfo);
  };
  return officeHolderTerm;
};
