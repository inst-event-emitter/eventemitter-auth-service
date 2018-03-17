'use strict';

const nconf = require('nconf');
const path = require('path');
const defaults = require('../../configs/defaults.json');

nconf.use('memory');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const env = process.env.NODE_ENV;
const configsPath = path.join(__dirname, '../../configs/');

nconf.argv()
    .env()
    .file('environmentConfig', {
      file: path.join(configsPath, env + '.json')
    })
    .defaults(defaults);
