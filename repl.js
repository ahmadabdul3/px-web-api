import fs from 'fs';
import path from 'path';
import repl from 'repl';
import db from 'src/db/models';
import classifyPoint from 'robust-point-in-polygon';
import {
  migrateOfficialsData,
  reassignPoliticianContactInfoToOfficeHolderTerm
} from 'src/services/data_migrations';
import { getAllWardsAsObj } from 'src/services/location_finder';
import { getAddressInfo } from 'src/services/address_manager';
import prepPoliticianModelForUi from 'src/services/ui_data_prep/ui_data_prepper_politician';

const { sequelize } = db;
const envName = process.env.NODE_ENV || "dev";

// open the repl session
const replServer = repl.start({
  prompt: "px - " + envName + " >> ",
});

// attach my modules to the repl context
replServer.context.db = db;
replServer.context.path = path;
replServer.context.fs = fs;
replServer.context.dirname = __dirname;
replServer.context.filename = __filename;
replServer.context.getAll = getAll;
replServer.context.migrateOfficialsData = migrateOfficialsData;
replServer.context.reassignPoliticianContactInfoToOfficeHolderTerm = reassignPoliticianContactInfoToOfficeHolderTerm;
replServer.context.classifyPoint = classifyPoint;
replServer.context.getNewHavenWards = getAllWardsAsObj;
replServer.context.getAddressInfo = getAddressInfo;
replServer.context.prepPoliticianModelForUi = prepPoliticianModelForUi;
replServer.context.createRacesForCurrentPositions = createRacesForCurrentPositions;
replServer.context.createCandidatesForCurrentPositions = createCandidatesForCurrentPositions;

function getAll(modelName) {
  db[modelName].findAll().then(res => {
    res.forEach(record => {
      console.log('*** RECORD START ***');
      console.log(record.dataValues || 'No Record Found');
      console.log('*** RECORD END ***');
    });
  });
}

function createRacesForCurrentPositions() {
  const raceForPosition = {};
  const bulkRaceData = [];
  db.politician.findAllWithRelations().then(politicians => {
    politicians.forEach(p => {
      const normalizedP = db.politician.normalizedForUi(p);
      const {
        levelOfResponsibility,
        areaOfResponsibility,
        titlePrimary,
      } = normalizedP;
      const raceKey = [levelOfResponsibility, areaOfResponsibility, titlePrimary].join('-');
      if (!levelOfResponsibility || !areaOfResponsibility || !titlePrimary) return;
      if (raceForPosition[raceKey]) return;
      const newRace = {
        levelOfResponsibility,
        areaOfResponsibility,
        position: titlePrimary,
        electionDate: new Date(),
        currentOfficeHolder: normalizedP.id,
      };
      raceForPosition[raceKey] = newRace;
      bulkRaceData.push(newRace);
    });
    console.log(bulkRaceData);
    db.race.bulkCreate(bulkRaceData).then(res => {
      console.log(res);
    });
  });
}

function createCandidatesForCurrentPositions() {
  let politiciansObj = {};
  const bulkCandidateData = [];
  db.politician.findAllWithRelations().then(politicians => {
    politiciansObj = politicians.reduce((all, p) => {
      const normalizedP = db.politician.normalizedForUi(p);
      const { levelOfResponsibility, areaOfResponsibility, titlePrimary } = normalizedP;
      const key = [levelOfResponsibility, areaOfResponsibility, titlePrimary].join('-');
      all[key] = normalizedP;
      return all;
    }, {});
    return;
  }).then(_ => {
    return db.race.findAll();
  }).then(races => {
    races.forEach(race => {
      const r = race.get({ raw: true });
      const {
        levelOfResponsibility,
        areaOfResponsibility,
        position,
        id,
      } = r;
      const polKey = [levelOfResponsibility, areaOfResponsibility, position].join('-');
      const pol = politiciansObj[polKey];
      const newCandidateTerm = {
        positionRunningFor: position,
        positionCurrentOfficeHolder: true,
        runningUnderParty: pol.party,
        raceId: id,
        incumbentId: pol.officeHolderTermId,
        politicianId: pol.id
      };
      bulkCandidateData.push(newCandidateTerm);
    });
    console.log(bulkCandidateData);
    db.candidateTerm.bulkCreate(bulkCandidateData).then(res => {
      console.log(res);
    });
  });
}

// ***
// some useful sequelize queries
// ***

// db.politician.findAll({
//   include: [
//     db.officeHolderTerm,
//     db.contactInfo,
//   ]
// }).then(res => {
//   politician = res[0].dataValues;
// });
//
// politician.officeHolderTerms[0].dataValues
// politician.contactInfos[0].dataValues
//
// db.contactInfo.create({
//   ...contactInfoPolitician,
//   id: null,
//   politicianId: null,
//   officeHolderTermId: officeHolderTerm.id
// }).then(res => {
//   contactInfoOht = res;
// });
//
// db.politician.findAll({
//   include: [{
//     model: db.officeHolderTerm,
//     required: true,
//     where: {
//       levelOfResponsibility: 'district',
//       areaOfResponsibility: '1',
//     },
//     include: [{
//       model: db.contactInfo,
//       required: true,
//       where: {
//         city: { ilike: 'new haven' },
//         state: { ilike: 'connecticut' },
//       },
//     }],
//   }],
// }).then(res => {
//   result = res;
// });
//
// result[0].dataValues.officeHolderTerms[0].dataValues
//
// db.politician.findAll({
//   include: [ db.contactInfo ],
// }).then(res => {
//   res.forEach(item => {
//     console.log(item.get({ plain: true }));
//   });
// });
