import db from 'src/db/models';
const { sequelize } = db;

export function reassignPoliticianContactInfoToOfficeHolderTerm() {
  db.politician.findAll({
    include: [ db.officeHolderTerm ]
  }).then(politicians => {
    politicians.forEach(p => {
      const politician = p.get({ plain: true });
      const politicianId = politician.id;
      const officeHolderTermId = politician.officeHolderTerms[0].id;

      db.contactInfo.update(
        { politicianId: null, officeHolderTermId },
        { where: { politicianId } }
      );
    });
  });
}

export function migrateOfficialsData() {
  db.official.findAll().then(officials => {
    officials.forEach(official => {
      const { politician, officeHolderTerm, contactInfo } = seperateOfficialData(official);

      sequelize.transaction(transaction => {
        return db.politician.create(politician, { transaction }).then(createdPolitician => {
          return createdPolitician.dataValues;
        }).then(createdPolitician => {
          return db.officeHolderTerm.create({ ...officeHolderTerm, politicianId: createdPolitician.id }, { transaction }).then(() => {
            return createdPolitician;
          });
        }).then(createdPolitician => {
          return db.contactInfo.create({ ...contactInfo, politicianId: createdPolitician.id }, { transaction });
        });
      }).then(res => {
        console.log('**************************');
        console.log('SUCCESSFULLY MIGRATED DATA');
        console.log('**************************');
      }).catch(err => {
        console.log('****************');
        console.log('AN ERROR OCCURED');
        console.log('****************');
        console.log(err);
      });
    });
  });
}

function seperateOfficialData(official) {
  return {
    politician: getPoliticianDataFromOfficial(official),
    officeHolderTerm: getOfficeHolderTermFromOfficial(official),
    contactInfo: getContactInfoFromOfficial(official),
  };
}

function getPoliticianDataFromOfficial(official) {
  return {
    firstName: official.firstName,
    middleName: official.middleName,
    lastName: official.lastName,
    suffix: official.suffix,
  };
}

function getOfficeHolderTermFromOfficial(official) {
  return {
    party: official.party,
    titlePrimary: official.titlePrimary,
    titleSecondary: official.titleSecondary,
    levelOfResponsibility: official.levelOfResponsibility,
    areaOfResponsibility: official.areaOfResponsibility,
  };
}

function getContactInfoFromOfficial(official) {
  return {
    email: official.email,
    phone: official.phone,
    streetAddress: official.streetAddress,
    city: official.city,
    state: official.state,
    zipCode: official.zipCode,
  };
}
