const fetch = require('node-fetch');
const db = require('./db');
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require('./config');

async function authorizeStrava(code) {
  try {
    const url = `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`;

    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    const {
      access_token: stravaAccessToken,
      expires_at: expiresAt,
      refresh_token: refreshToken,
      athlete,
    } = data;
    const athleteID = athlete.id;

    const queryString = `INSERT INTO auth(strava_athlete_id, strava_access_token, strava_expires_at, strava_refresh_token) VALUES (${athleteID}, '${stravaAccessToken}', ${expiresAt}, '${refreshToken}')`;

    let isFirstTime = true;
    try {
      await db.query(queryString);
    } catch (error) {
      if (error.code === '23505') {
        isFirstTime = false;
        console.log('Athlete already in database.');
      } else {
        console.log(error);
      }
    }

    return {
      stravaAccessToken,
      athlete,
      isFirstTime,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = authorizeStrava;
