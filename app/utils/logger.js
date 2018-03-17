'use strict';

const config = require('nconf');
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const logConfig = config.get('log');

let prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

if (process.env.NODE_ENV === 'dev') {
  logConfig.streams.push({
    level: 'trace',
    stream: prettyStdOut
  });
}

logConfig.streams.push({
  level: 'warn',
  stream: prettyStdOut
});

const parent = bunyan.createLogger(logConfig);
let loggerCollector = [parent];

// Process "reloadLogs" pm2 command, use new .log file after log rotation
process.on('SIGUSR2', _reloadLoggers);

function getLogger(component, options) {
  const logger = parent.child(Object.assign({
    component: component || 'Undefined component'
  }, options));

  loggerCollector.push(logger);

  return logger;
}

function _reloadLoggers() {
  loggerCollector.forEach(logger => logger.reopenFileStreams());
}

module.exports = getLogger;
