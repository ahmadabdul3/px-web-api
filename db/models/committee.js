'use strict';
module.exports = (sequelize, DataTypes) => {
  var committee = sequelize.define('committee', {
    name: DataTypes.TEXT
  }, {});

  committee.associate = function(models) {
    committee.hasMany(models.committeeTerm);
  };

  return committee;
};
