const httpErrors = require('http-errors');
const httpStatus = require('http-status');
const { pick } = require('lodash');

const getErrorStatusCode = err =>
  err.status ||
  err.statusCode ||
  httpStatus.INTERNAL_SERVER_ERROR;

const notFound = () => {
  throw new httpErrors.NotFound('Resource not found');
};

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = getErrorStatusCode(err);

  res.status(statusCode).json(pick(err, 'message', 'errors'));
};

module.exports = {
  notFound,
  errorHandler,
};
