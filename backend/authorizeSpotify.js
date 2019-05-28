const fetch = require('node-fetch');
const db = require('./db');
const { SPOTIFY_AUTHORIZATION } = require('./config');

async function authorizeSpotify(athleteID, code, redirectURI) {
  try {
    const url = 'https://accounts.spotify.com/api/token';

    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectURI,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${SPOTIFY_AUTHORIZATION}`,
    };

    const searchParams = new URLSearchParams();

    Object.keys(data).forEach(prop => {
      searchParams.set(prop, data[prop]);
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: searchParams,
    });

    const spotifyAuth = await response.json();

    const {
      access_token: spotifyAccessToken,
      refresh_token: spotifyRefreshToken,
    } = spotifyAuth;

    const queryString = `UPDATE auth SET spotify_access_token = '${spotifyAccessToken}', spotify_refresh_token = '${spotifyRefreshToken}' WHERE strava_athlete_id = ${athleteID}`;

    await db.query(queryString);
    return { spotifyAccessToken };
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = authorizeSpotify;
