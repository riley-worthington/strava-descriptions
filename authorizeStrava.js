const { STRAVA_CLIENT_ID } = require('./config');

const authorizeStrava = (req, res) => {
  const scopes = 'activity:read_all,activity:write';
  const client_id = STRAVA_CLIENT_ID;
  const redirect_uri = 'http://localhost';

  const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURI(redirect_uri)}&response_type=code&scope=${scopes}`;

  res.redirect(url);
}

module.exports = authorizeStrava;
