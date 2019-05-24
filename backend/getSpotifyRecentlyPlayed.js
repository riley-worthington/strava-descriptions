const fetch = require('node-fetch');

const getSpotifyRecentlyPlayed = (after, accessToken) => {
  // after should be Unix timestamp in milliseconds
  const url = `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${after}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(err => console.log('Problem getting recently played', err));
};

module.exports = getSpotifyRecentlyPlayed;
