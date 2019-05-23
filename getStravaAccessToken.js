const fetch = require('node-fetch');
const db = require('./db');
const {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET
} = require('./config');

const refreshStravaToken = (refresh_token, athlete_id) => {
  const url = `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refresh_token}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      const { access_token, expires_at, refresh_token } = res;
      // update database here
      return db.query(`UPDATE auth SET strava_access_token = '${access_token}', strava_expires_at = ${expires_at}, strava_refresh_token = '${refresh_token}' WHERE strava_athlete_id = ${athlete_id} RETURNING strava_access_token;`);
    })
    .then(res => res.rows[0]['strava_access_token'])
    .catch(err => console.log(`Couldn't refresh Strava token.`, err))
}


const getStravaAccessToken = (athlete_id) => {
  return db.query(`SELECT strava_access_token, strava_expires_at, strava_refresh_token FROM auth WHERE strava_athlete_id = ${athlete_id};`)
    .then(res => {
      const authInfo = res.rows[0];
      const currentTime = Math.floor(Date.now() / 1000);
      if (authInfo['strava_expires_at'] - currentTime < 3600) {
        // get new access token from Strava using refresh token
        const refresh_token = authInfo['strava_refresh_token'];
        return refreshStravaToken(refresh_token, athlete_id);
      } else {
        return authInfo['strava_access_token'];
      }
    })
    .catch(err => console.log(`Couldn't get Strava token.`, err));
}

module.exports = getStravaAccessToken;
