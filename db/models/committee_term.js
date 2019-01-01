'use strict';
module.exports = (sequelize, DataTypes) => {
  var committeeTerm = sequelize.define('committeeTerm', {
    politicianId: DataTypes.UUIDV4,
    officeHolderTermId: DataTypes.INTEGER,
    committeeId: DataTypes.INTEGER,
    title: DataTypes.TEXT
  }, {});

  committeeTerm.associate = function(models) {
    committeeTerm.belongsTo(models.committee);
    committeeTerm.belongsTo(models.officeHolderTerm);
    // - we may need this relationship in the future
    //   for now we're good
    // committeeTerm.belongsTo(models.politican);
  };

  return committeeTerm;
};
