const bodyParser = require('body-parser');
const authRouter = require('express').Router();

const {
  setup2Auth, get2Auth, remove2Auth, verifyAuth, login
} = require('../controllers/auth');

const ensureLogin = (req, res, next) => {
  // TODO: Check user credentials in the db and set req.user
  next();
};

const initRoutes = (app) => {
  authRouter.use(bodyParser.json());

  authRouter.post('/auth/2fa', ensureLogin, setup2Auth);
  authRouter.get('/auth/2fa', ensureLogin, get2Auth);
  authRouter.delete('/auth/2fa', ensureLogin, remove2Auth);

  authRouter.post('/auth/login', ensureLogin, login);

  authRouter.post('/auth/verify', ensureLogin, verifyAuth);

  app.use(authRouter);
};

module.exports = initRoutes;
