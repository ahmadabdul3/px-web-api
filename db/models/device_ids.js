'use strict';
module.exports = (sequelize, DataTypes) => {
  var deviceIds = sequelize.define('deviceIds', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    deviceId: DataTypes.TEXT,
    status: DataTypes.TEXT,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  deviceIds.associate = function(models) {
    // associations can be defined here
  };
  return deviceIds;
};
