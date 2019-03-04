'use strict';
import models from 'src/db/models';

module.exports = (sequelize, DataTypes) => {
  const race = sequelize.define('race', {
    electionDate: DataTypes.DATE,
    levelOfResponsibility: DataTypes.TEXT,
    areaOfResponsibility: DataTypes.TEXT,
    position: DataTypes.TEXT
  }, {});
  race.associate = function(models) {
    // associations can be defined here
  };

  race.findAllWithRelations = (ops) => {
    const options = ops && ops.options;
    return race.findAll({
      ...options,
    });
  };

  race.findAllWithRelationsForLocation = ({ location }) => {
    const { state, city, district } = location;
    const options = {
      where: {
        [models.Sequelize.Op.or]: [
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
