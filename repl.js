import repl from 'repl';
import db from 'src/db/models';
import { migrateOfficialsData } from 'src/services/data_migrations';

const { sequelize } = db;
const envName = process.env.NODE_ENV || "dev";

// open the repl session
const replServer = repl.start({
  prompt: "app (" + envName + ") >> ",
});

// attach my modules to the repl context
replServer.context.db = db;
replServer.context.getAll = getAll;
replServer.context.migrateOfficialsData = migrateOfficialsData;


function getAll(modelName) {
  db[modelName].findAll().then(res => {
    res.forEach(record => {
      console.log('*** RECORD START ***');
      console.log(record.dataValues || 'No Record Found');
      console.log('*** RECORD END ***');
    });
  });
}
