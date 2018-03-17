require('./app/utils/initializeConfig');

const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/server')(app);
