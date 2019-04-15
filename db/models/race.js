'use strict';
import models from 'src/db/models';

module.exports = (sequelize, DataTypes) => {
  const race = sequelize.define('race', {
    electionDate: DataTypes.DATE,
    levelOfResponsibility: DataTypes.TEXT,
    areaOfResponsibility: DataTypes.TEXT,
    currentOfficeHolder: DataTypes.INTEGER,
    position: DataTypes.TEXT
  }, {});
  race.associate = function(models) {
    race.belongsTo(models.officeHolderTerm, { foreignKey: 'currentOfficeHolder' });
    race.hasMany(models.candidateTerm);
  };

  // - need to add an association between race and officeHolderTerm
  //   to know who is the current office holder for the race position
  // - it needs to be different from the 'incumbant' because the current
  //   office holder for the position may not run for the same position again
  //   so there would be no 'incumbent'
  race.findAllWithRelations = (ops) => {
    const options = ops && ops.options;
    return race.findAll({
      ...options,
      include: [
        {
          model: models.officeHolderTerm,
          where: {
            levelOfResponsibility: { $col: 'race.levelOfResponsibility' },
            areaOfResponsibility: { $col: 'race.areaOfResponsibility' },
            titlePrimary: { $col: 'race.position' }
          },
          include: [{ model: models.politician }],
        },
        {
          model: models.candidateTerm,
          include: [{
            model: models.politician,
            include: [{ model: models.user }]
          }],
        },
      ],
    });
  };

  race.findAllWithRelationsForLocation = ({ location }) => {
    const { state, city, district } = location;
    const options = {
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

    return race.findAllWithRelations({ options });
  }

  return race;
};
