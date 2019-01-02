'use strict';

import models from 'src/db/models';
import prepPoliticianModelForUi from 'src/services/ui_data_prep/ui_data_prepper_politician';

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
    // - we may need this relationship in the future
    //   for now we're good
    // politician.hasMany(models.committeeTerm);
  };

  politician.findAllWithRelations = (conditions) => {
    return politician.findAll({
      include: [{
        model: models.officeHolderTerm,
        include: [{
          model: models.contactInfo
        }],
      }],
      ...conditions,
    });
  };

  // - this assumes the politican was fetched from the db with the related
  //   models included (officeHolderTerm and contactInfo)
  politician.normalizedForUi = (p) => {
    const pol = p.get({ plain: true });
    const officeHolderTerm = pol.officeHolderTerms[0];
    const contactInfo = officeHolderTerm.contactInfos[0];

    return prepPoliticianModelForUi({
      ...pol,
      ...officeHolderTerm,
      ...contactInfo,
      id: pol.id,
      officeHolderTermId: officeHolderTerm.id,
      contactInfoId: contactInfo.id,
    });
  }

  politician.findDuplicates = ({
    city,
    state,
    levelOfResponsibility,
    areaOfResponsibility,
    titlePrimary
  }) => {
    return politician.findAll({
      include: [{
        model: models.officeHolderTerm,
        required: true,
        where: { levelOfResponsibility, areaOfResponsibility, titlePrimary },
        include: [{
          model: models.contactInfo,
          required: true,
          where: { city, state },
        }],
      }],
    });
  };

  return politician;
};
