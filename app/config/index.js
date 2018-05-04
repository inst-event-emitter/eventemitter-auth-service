const path = require('path');
const dotenv = require('dotenv');
const nconf = require('nconf');

const defaults = require('./defaults.json');

dotenv.config();
nconf.use('memory');

const env = process.env.NODE_ENV || 'dev';

nconf
  .argv()
  .env()
  .file('envConfig', path.join(__dirname, `${env}.json`))
  .defaults(defaults);

nconf.set('postgreSql:username', process.env.POSTGRESQL_USERNAME);
nconf.set('postgreSql:password', process.env.POSTGRESQL_PASSWORD);

module.exports = nconf;
