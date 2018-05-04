const initializer = require('./app/utils/initializer');

const server = require('./app/server');

initializer.appReady()
  .then(server.initApp)
  .then(server.startApp);
