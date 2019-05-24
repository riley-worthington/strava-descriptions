const fetch = require('node-fetch');
const db = require('./db');
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require('./config');

const refreshStravaToken = (refreshToken, athleteId) => {
  const url = `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      const {
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: newRefreshToken,
      } = res;
      // update database here
      return db.query(`UPDATE auth SET strava_access_token = '${accessToken}', strava_expires_at = ${expiresAt}, strava_refresh_token = '${newRefreshToken}' WHERE strava_athlete_id = ${athleteId} RETURNING strava_access_token;`);
    })
    .then(res => res.rows[0].strava_access_token)
    .catch(err => console.log(`Couldn't refresh Strava token. ${err}`));
};


const getStravaAccessToken = athleteId => {
  const queryString = `SELECT strava_access_token, strava_expires_at, strava_refresh_token FROM auth WHERE strava_athlete_id = ${athleteId};`;

  return db.query(queryString)
    .then(res => {
      const authInfo = res.rows[0];
      const currentTime = Math.floor(Date.now() / 1000);
      if (authInfo.strava_expires_at - currentTime < 3600) {
        // get new access token from Strava using refresh token
        const refreshToken = authInfo.strava_refresh_token;
        return refreshStravaToken(refreshToken, athleteId);
      }
      return authInfo.strava_access_token;
    })
    .catch(err => console.log(`Couldn't get Strava token. ${err}`));
};


module.exports = getStravaAccessToken;
