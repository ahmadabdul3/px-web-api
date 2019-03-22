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
    suffix: DataTypes.TEXT,
    missionStatement: DataTypes.TEXT,
  }, {});

  politician.associate = function(models) {
    politician.hasMany(models.officeHolderTerm);
    politician.hasMany(models.candidateTerm);
    politician.hasMany(models.contactInfo);
    politician.belongsTo(models.user);
    // - we may need this relationship in the future
    //   for now we're good
    // politician.hasMany(models.committeeTerm);
  };

  politician.findAllWithRelationsForLocation = ({ location }) => {
    const { state, city, district } = location;
    const officeHolderTermOptions = {
      where: {
        [models.Sequelize.Op.or]: [
          {
            areaOfResponsibility: 'USA',
          },
          {
            areaOfResponsibility: city,
            levelOfResponsibility: "City",
          },
          {
            areaOfResponsibility: state,
            levelOfResponsibility: "State",
          },
          {
            areaOfResponsibility: district,
            levelOfResponsibility: "District",
          }
        ]
      }
    };
    return politician.findAllWithRelations({ officeHolderTermOptions });
  };

  politician.findAllWithRelations = (ops) => {
    const { Op } = models.Sequelize;
    const options = ops && ops.options;
    const officeHolderTermOptions = ops && ops.officeHolderTermOptions;
    const officeHolderTermOptionsWhere = ops
      && ops.officeHolderTermOptions
      && ops.officeHolderTermOptions.where || {};
    const contactInfoOptions = ops && ops.contactInfoOptions;
    return politician.findAll({
      ...options,
      include: [
        {
          model: models.user,
        },
        {
          model: models.officeHolderTerm,
          ...officeHolderTermOptions,
          where: {
            ...officeHolderTermOptionsWhere,
            testData: {
              [Op.not]: true,
            },
          },
          include: [
            {
              model: models.contactInfo,
              ...contactInfoOptions,
            },
            {
              model: models.committeeTerm,
              include: [{
                model: models.committee,
              }],
            }
          ],
        }
      ],
    });
  };

  politician.findOneWithRelations = ({ id, options }) => {
    return politician.findAllWithRelations({ options: {
      ...options, where: { id }
    }}).then(r => r[0]);
  };

  politician.createWithRelations = (data) => {
    let politicianData;
    delete data.id;
    const { firstName, lastName } = data;
    const userData = {
      firstName,
      lastName,
      role: 'politician',
    };

    return sequelize.transaction(transaction => {
      return models.user.create(userData, { transaction }).then(userRes => {
        data.userId = userRes.dataValues.id;
        return politician.create(data, { transaction });
      }).then(polRes => {
        politicianData = polRes;
        const politicianId = polRes.dataValues.id;
        return models.officeHolderTerm.create({ ...data, politicianId }, { transaction });
      }).then(ohtRes => {
        const officeHolderTermId = ohtRes.dataValues.id;
        return models.contactInfo.create({ ...data, officeHolderTermId }, { transaction });
      }).catch(err => {
        console.log('POLITICIAN ERROR - createWithRelations ***', err);
        throw(err);
      });
    }).then(result => {
      const { id } = politicianData.dataValues;
      return politician.findOneWithRelations({ id });
    }).then(politicianWithRelations => {
      console.log('politicianWithRelations', politicianWithRelations);
      return politician.normalizedForUi(politicianWithRelations);
    }).catch(err => {
      console.log('POLITICIAN TRANSACTION ERROR - createWithRelations ***', err);
      throw(err);
    });
  };

  politician.updateWithRelations = (data) => {
    const { id } = data;
    // - remove the id so that it doesnt get updated
    delete data.id;

    return sequelize.transaction(transaction => {
      return politician.update(data, {
        transaction,
        where: { id },
        returning: true,
      }).then(polRes => {
        const politicianId = polRes[1][0].dataValues.id;
        return models.officeHolderTerm.update(data, {
          transaction,
          where: { politicianId },
          returning: true,
        });
      }).then(ohtRes => {
        const officeHolderTermId = ohtRes[1][0].dataValues.id;
        return models.contactInfo.update(data, {
          transaction,
          where: { officeHolderTermId },
          returning: true,
        });
      }).catch(err => {
        console.log('POLITICIAN ERROR - updateWithRelations ***', err);
        throw(err);
      });
    }).then(result => {
      return politician.findOneWithRelations({ id });
    }).then(politicianWithRelations => {
      console.log('politicianWithRelations', politicianWithRelations);
      return politician.normalizedForUi(politicianWithRelations);
    }).catch(err => {
      console.log('POLITICIAN TRANSACTION ERROR - createWithRelations ***', err);
      throw(err);
    });
  };

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

  // - this assumes the politican was fetched from the db with the related
  //   models included (officeHolderTerm and contactInfo)
  politician.normalizedForUi = (p) => {
    const pol = p.get({ plain: true });
    const userId = pol.user && pol.user.id;
    const officeHolderTerm = pol.officeHolderTerms && pol.officeHolderTerms[0] || {};
    const contactInfo = officeHolderTerm.contactInfos && officeHolderTerm.contactInfos[0] || {};
    const committeeTerms = officeHolderTerm.committeeTerms;
    let committees = [];

    if (committeeTerms) {
      committees = committeeTerms.map(ct => {
        const { committee } = ct;
        return {
          committeeTermId: ct.id,
          committeeTermTitle: ct.title,
          committeeName: committee.name,
          committeeId: committee.id,
        };
      });
    }

    return prepPoliticianModelForUi({
      ...pol,
      ...officeHolderTerm,
      ...contactInfo,
      committees,
      userId,
      id: pol.id,
      officeHolderTermId: officeHolderTerm.id,
      contactInfoId: contactInfo.id,
    });
  };

  return politician;
};
