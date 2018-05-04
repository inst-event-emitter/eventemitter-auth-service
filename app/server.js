const app = require('express')();
const cors = require('cors');
const nconf = require('nconf');
const morgan = require('morgan');

const logger = require('./utils/logger')('server');
const { errorHandler, notFound } = require('./middleware/error_handler');

const initApp = () => {
  app.use(cors());

  const env = process.env.NODE_ENV || 'dev';
  if (env === 'dev') {
    app.use(morgan(env));
  }



  app.use(notFound);
  app.use(errorHandler);

  return Promise.resolve();
};

const startApp = () => {
  const port = process.env.PORT || nconf.get('server:port');

  app.listen(port, (err) => {
    if (err) {
      logger.error(err, 'Internal server error');
    } else {
      logger.info({ port }, 'Express serving now running.');
    }
  });

  process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
};

module.exports = {
  initApp,
  startApp,
  app,
};
