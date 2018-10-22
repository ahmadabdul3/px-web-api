// - this import is needed for the config to
//   correctly see the env variables
const dotenv = require('dotenv').config();

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    underscored: false
  },
};

export default config;
