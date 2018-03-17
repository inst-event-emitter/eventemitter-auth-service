'use strict';

const nconf = require('nconf');
const pg = require('pg-promise')({});
const db = pg(nconf.get('db'));

function getAccessToken(accessToken) {
  return db.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id ' +
      'FROM oauth_tokens ' +
      'WHERE access_token = $1', [accessToken])
      .then(function (result) {
        const token = result.rows[0];

        return {
          accessToken: token.access_token,
          client: {id: token.client_id},
          expires: token.expires,
          user: {id: token.userId}
        };
      });
}

function getClient(clientId, clientSecret) {
  return db.query('SELECT client_id, client_secret, redirect_uri ' +
      'FROM oauth_clients ' +
      'WHERE client_id = $1 AND client_secret = $2', [clientId, clientSecret])
      .then(function (result) {
        const oAuthClient = result.rows[0];

        if (!oAuthClient) {
          return;
        }

        return {
          clientId: oAuthClient.client_id,
          clientSecret: oAuthClient.client_secret,
          grants: ['password']
        };
      });
}

function getRefreshToken(refreshToken) {
  return db.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id ' +
      'FROM oauth_tokens ' +
      'WHERE refresh_token = $1', [refreshToken])
      .then(function (result) {
        return result.rowCount ? result.rows[0] : false;
      });
}

function getUser(username, password) {
  return db.query('SELECT id ' +
      'FROM users ' +
      'WHERE username = $1 AND password = $2', [username, password])
      .then(function (result) {
        return result.rowCount ? result.rows[0] : false;
      });
}

function saveToken(token, client, user) {
  return db.query('INSERT INTO ' +
      'oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6)', [
    token.accessToken,
    token.accessTokenExpiresOn,
    client.id,
    token.refreshToken,
    token.refreshTokenExpiresOn,
    user.id
  ]).then(function (result) {
    return result.rowCount ? result.rows[0] : false;
  });
}

module.exports.getAccessToken = getAccessToken;
module.exports.getClient = getClient;
module.exports.getRefreshToken = getRefreshToken;
module.exports.getUser = getUser;
module.exports.saveToken = saveToken;