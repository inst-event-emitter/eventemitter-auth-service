const Sequelize = require('sequelize');
const nconf = require('nconf');

const postgreSqlClient = new Sequelize({
  ...nconf.get('postgreSql') || {},
  dialect: 'postgres'
});

module.exports = postgreSqlClient;
