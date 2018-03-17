'use strict';

const oauthServer = require('oauth2-server');
const model = require('./model');
const nconf = require('nconf');
const log = require('./utils/logger')('app');

module.exports = function (app) {
  app.oauth = new oauthServer({
    model: model
  });

  require('./route')(app);

  app.listen(nconf.get('port'), () => {
    log.info('Auth service listening on port ' + nconf.get('port'));
  });
};