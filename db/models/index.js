import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'src/db/config';
import official from './official';
import politician from './politician';
import officeHolderTerm from './office_holder_term';
import candidateTerm from './candidate_term';
import contactInfo from './contact_info';
import committee from './committee';
import committeeTerm from './committee_term';
import race from './race';
import user from './user';
import message from './message';
import deviceIds from './device_ids';

const modelInitializers = [
  official,
  politician,
  officeHolderTerm,
  candidateTerm,
  contactInfo,
  committee,
  committeeTerm,
  race,
  user,
  message,
  deviceIds,
];

const sequelize = initializeDatabase();
const models = initializeModels();
establishModelAssociations();

models.sequelize = sequelize;
models.Sequelize = Sequelize;
export default models;

function initializeDatabase() {
  const envConfig = config[process.env.NODE_ENV];
  const { database, username, password } = envConfig;
  return new Sequelize(database, username, password, envConfig);
}

function initializeModels() {
  return modelInitializers.reduce(function(allModels, modelInitializer) {
    const model = modelInitializer(sequelize, Sequelize);
    allModels[model.name] = model;
    return allModels;
  }, {});
}

function establishModelAssociations() {
  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    if (model.associate) model.associate(models);
  });
}
