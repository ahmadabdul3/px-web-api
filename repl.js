import repl from 'repl';
import db from 'src/db/models';

const envName = process.env.NODE_ENV || "dev";

// open the repl session
const replServer = repl.start({
  prompt: "app (" + envName + ") > ",
});

// attach my modules to the repl context
replServer.context.db = db;
