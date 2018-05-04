const config = require('nconf');
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const fs = require('fs');

const logsDir = config.get('logger:logsDir');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logConfig = config.get('logger');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const env = process.env.NODE_ENV || 'dev';
if (env === 'dev') {
  logConfig.streams.push({
    level: 'info',
    stream: prettyStdOut
  });
}
logConfig.streams.push({
  level: 'warn',
  stream: prettyStdOut
});

const parent = bunyan.createLogger(logConfig);
const loggerCollector = [parent];
process.once('SIGUSR2', () => {
  loggerCollector.forEach(logger => logger.reopenFileStreams());
});

const getLogger = (component, options) => {
  const logger = parent.child(Object.assign({
    component: component || 'Undefined component'
  }, options));
  loggerCollector.push(logger);
  return logger;
};

module.exports = getLogger;
