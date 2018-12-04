'use strict';
module.exports = (sequelize, DataTypes) => {
  const candidateTerm = sequelize.define('candidateTerm', {
    positionRunningFor: DataTypes.TEXT,
    positionCurrentOfficeHolder: DataTypes.BOOLEAN,
    electionResult: DataTypes.TEXT,
    runningUnderParty: DataTypes.TEXT
  }, {});
  candidateTerm.associate = function(models) {
    candidateTerm.belongsTo(models.politician);
  };
  return candidateTerm;
};
