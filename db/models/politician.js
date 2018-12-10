'use strict';
module.exports = (sequelize, DataTypes) => {
  const politician = sequelize.define('politician', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    firstName: DataTypes.TEXT,
    middleName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    suffix: DataTypes.TEXT
  }, {});
  politician.associate = function(models) {
    politician.hasMany(models.officeHolderTerm);
    politician.hasMany(models.candidateTerm);
    politician.hasMany(models.contactInfo);
  };
  return politician;
};
