const fetch = require('node-fetch');
const db = require('./db');
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_AUTHORIZATION
} = require('./config');

const refreshSpotifyToken = (refreshToken, athleteId) => {
  const url = 'https://accounts.spotify.com/api/token';

  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${SPOTIFY_AUTHORIZATION}`
  };

  const searchParams = new URLSearchParams();

  Object.keys(data).forEach(prop => {
    searchParams.set(prop, data[prop]);
  });

  return fetch(url, {
    method: 'POST',
    headers,
    body: searchParams,
  })
    .then(res => res.json())
    .then(res => {
      const { access_token } = res;
      // Update Spotify token in auth database
      return db.query(`UPDATE auth SET spotify_access_token = '${access_token}' WHERE strava_athlete_id = ${athleteId} RETURNING spotify_access_token;`);
    })
    .then(res => {
      return res.rows[0]['spotify_access_token'];
    })
    .catch(error => console.log(error));

}


const getSpotifyAccessToken = (athlete_id) => {
  return db.query(`SELECT spotify_refresh_token FROM auth WHERE strava_athlete_id = ${athlete_id};`)
    .then(res => {
      const refreshToken = res.rows[0]['spotify_refresh_token'];
      return refreshSpotifyToken(refreshToken, athlete_id);
    })
    .catch(error => console.log(error));
}

module.exports = getSpotifyAccessToken;
