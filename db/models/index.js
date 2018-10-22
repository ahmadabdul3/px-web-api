import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'src/db/config';
import official from './official';

const modelInitializers = [
  official,
];
const sequelize = initializeDatabase();
const models = initializeModels();
establishModelAssociations();

models.sequelize = sequelize;
models.Sequelize = Sequelize;
export default models;

function initializeDatabase() {
  const { database, username, password } = config[process.env];
  return new Sequelize(database, username, password, config[process.env]);
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

// `
// https://nhgis.newhavenct.gov/server/rest/services/Web_Services/New_Haven_Wards/MapServer/1/
// query?
// f=json
// &
// returnGeometry=true
// &
// spatialRel=esriSpatialRelIntersects
// &
// geometry=
//   %7B%22
//   xmin%22%3A-8118223.649556708%2C%22
//   ymin%22%3A5057713.899355898%2C%22
//   xmax%22%3A-8118108.99401428%2C%22
//   ymax%22%3A5057828.554898325%2C%22
//   spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D
// &
// geometryType=esriGeometryEnvelope
// &
// inSR=102100
// &
// outFields=OBJECTID
//   %2CWARDS
//   %2CWarrds_txt
//   %2CWards_desc
//   %2CAlder
//   %2CLCI_Ward_Group
//   %2CORIG_FID
//   %2CAlder_addr
//   %2CAlder_City
//   %2CAlder_Zip
//   %2CAlder_img
//   %2CAlder_Bio
//   %2CAlder_email
//   %2CAlder_phone
// &
// outSR=102100
// `

// `
// https://nhgis.newhavenct.gov/server/rest/services/Web_Services/New_Haven_Wards/MapServer/0/
// query?
// f=json
// &
// returnGeometry=true
// &
// spatialRel=esriSpatialRelIntersects
// &
// geometry=
//   %7B%22
//   xmin%22%3A-8115016.539807044%2C%22
//   ymin%22%3A5052278.334613052%2C%22
//   xmax%22%3A-8115012.956821344%2C%22
//   ymax%22%3A5052281.917598751%2C%22
//   spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D
// &
// geometryType=esriGeometryEnvelope
// &
// inSR=102100
// &
// outFields=OBJECTID
//   %2CWARDS
//   %2CWarrds_txt
//   %2CWards_desc
//   %2CAlder
//   %2CLCI_Ward_Group
//   %2CORIG_FID
//   %2CAlder_addr
//   %2CAlder_City
//   %2CAlder_Zip
//   %2CAlder_img
//   %2CAlder_Bio
//   %2CAlder_email
//   %2CAlder_phone
// &
// outSR=102100
// `
