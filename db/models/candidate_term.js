'use strict';
module.exports = (sequelize, DataTypes) => {
  const candidateTerm = sequelize.define('candidateTerm', {
    positionRunningFor: DataTypes.TEXT,
    positionCurrentOfficeHolder: DataTypes.BOOLEAN,
    electionResult: DataTypes.TEXT,
    runningUnderParty: DataTypes.TEXT,
    raceId: DataTypes.INTEGER,
    incumbentId: DataTypes.INTEGER,
  }, {});

  candidateTerm.associate = function(models) {
    candidateTerm.belongsTo(models.politician);
    candidateTerm.belongsTo(models.race);
    candidateTerm.belongsTo(models.officeHolderTerm, { foreignKey: 'incumbentId' });
  };

  return candidateTerm;
};
