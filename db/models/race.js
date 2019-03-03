'use strict';
module.exports = (sequelize, DataTypes) => {
  var race = sequelize.define('race', {
    electionDate: DataTypes.DATE,
    levelOfResponsibility: DataTypes.TEXT,
    areaOfResponsibility: DataTypes.TEXT,
    position: DataTypes.TEXT
  }, {});
  race.associate = function(models) {
    // associations can be defined here
  };
  return race;
};
