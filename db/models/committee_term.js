'use strict';
import { sequelizeErrorUniqueness } from 'src/services/sequelize_error_transformer';
import models from 'src/db/models';

module.exports = (sequelize, DataTypes) => {
  var committeeTerm = sequelize.define('committeeTerm', {
    politicianId: DataTypes.UUIDV4,
    officeHolderTermId: DataTypes.INTEGER,
    committeeId: DataTypes.INTEGER,
    title: DataTypes.TEXT,
  }, {});

  committeeTerm.associate = function(models) {
    committeeTerm.belongsTo(models.committee);
    committeeTerm.belongsTo(models.officeHolderTerm);
    // - we may need this relationship in the future
    //   for now we're good
    // committeeTerm.belongsTo(models.politican);
  };

  // - this hook is not working for some reason,
  //   no time to debug now, but should be looked into in the future
  committeeTerm.beforeCreate = function(model, options) {
    console.log(' before create ', model);
    return committeeTerm.validateRelationUniqueness(model).then(() => {
      return committeeTerm.validateTitleUniqueness(model);
    }).catch(err => {
      console.log('BEFORE CREATE ERROR', err);
      return err;
    });
  };

  committeeTerm.validateRelationUniqueness = function(committeeTerm) {
    const { committeeId, officeHolderTermId } = committeeTerm;

    return models.committeeTerm.findOne({
      where: { committeeId, officeHolderTermId }
    }).then(res => {
      if (!res) return;
      const customMessage = 'This politician is already part of this committee';
      throw sequelizeErrorUniqueness({ customMessage });
    });
  };

  committeeTerm.validateTitleUniqueness = function(committeeTerm) {
    const { title, committeeId } = committeeTerm;
    if (!title) return new Promise((resolve, reject) => { resolve(); });

    return models.committeeTerm.findOne({ where: { title, committeeId } }).then(res => {
      if (!res) return;
      const customMessage = `There is already a ${title} for the selected committee`;
      throw sequelizeErrorUniqueness({ customMessage });
    });
  };

  return committeeTerm;
};
