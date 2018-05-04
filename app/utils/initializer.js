require('../config');

const logger = require('../utils/logger')('initializer');
const postgreSqlClient = require('../services/postgreSql');

const postgreSqlInitialization = () => new Promise((resolve, reject) => {
  postgreSqlClient.authenticate()
    .then(() => {
      logger.info('Successfully connected to PostgreSQL database');
      resolve();
    })
    .catch((err) => {
      logger.error(`PostgreSQL connection error: ${err}`);
      reject(err)
    })
});

module.exports.appReady = () => Promise.all([
  postgreSqlInitialization(),
])
  .then(() => {
    logger.info('All services initialized successfully');
  })
  .catch((err) => {
    logger.error(`Initialization error: ${err}`);
  });
