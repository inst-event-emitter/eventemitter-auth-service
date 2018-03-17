'use strict';

module.exports = function (app) {
  // Get authorization.
  app.get('/oauth/authorize', function (req, res) {
    if (!req.app.locals.user) {
      return res.status(403);
    }

    return res.json({
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri
    });
  });

  // Post login.
  app.post('/oauth/login', function (req, res) {
    // @TODO: implement login mechanism.
    oauth.authenticate(request, response)
        .then((token) => {
          return res.json({
            token: token
          });
        })
        .catch((err) => {
          // The request failed authentication.
        });
  });
};