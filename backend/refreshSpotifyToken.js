const fetch = require('node-fetch');
const db = require('./db');
const { SPOTIFY_AUTHORIZATION } = require('./config');

const refreshSpotifyToken = (refreshToken, athleteId) => {
  // Spotify tokens expire quickly, so we just always refresh
  const url = 'https://accounts.spotify.com/api/token';
  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${SPOTIFY_AUTHORIZATION}`,
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
    .then(res => {
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res;
    })
    .then(res => res.json())
    .then(res => {
      const { access_token: accessToken } = res;
      // Update Spotify token in auth database
      return db.query(`UPDATE auth SET spotify_access_token = '${accessToken}' WHERE strava_athlete_id = ${athleteId} RETURNING spotify_access_token;`);
    })
    .then(res => res.rows[0].spotify_access_token)
    .catch(err => {
      console.log(`Problem getting Spotify token: ${err}`);
      return null;
    });
};

module.exports = refreshSpotifyToken;
