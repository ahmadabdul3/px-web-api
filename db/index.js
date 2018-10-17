import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'src/db/config';
import official from 'src/db/models/official';

const modelsDir = path.join(__dirname, 'models');
const sequelize = initializeDatabase();
// const modelFiles = findModelFiles();
const db = {};
db[official.name] = official;

// buildDatabaseObject(modelFiles, sequelize);
establishModelAssociations();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

function initializeDatabase() {
  const { database, username, password } = config;
  return new Sequelize(database, username, password, config.development);
}

function findModelFiles() {
  // const basename = path.basename(module.filename);
  return fs.readdirSync(modelsDir).filter(file =>
    (file.indexOf('.') !== 0) &&
    // no need to check basename because it's not in the same folder
    // (file !== basename) &&
    (file.slice(-3) === '.js')
  );
}

function buildDatabaseObject(modelFiles, databaseConnection) {
  const databaseObject = {};

  modelFiles.forEach(modelFile => {
    const modelFilePath = path.join(modelsDir, modelFile);
    console.log('model file path', modelFilePath);
    const model = databaseConnection.import(modelFilePath);
    databaseObject[model.name] = model;
  });

  return databaseObject;
}

function establishModelAssociations() {
  Object.keys(db).forEach(modelName => {
    const model = db[modelName];
    if (model.associate) model.associate(db);
  });
}
