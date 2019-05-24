const { STRAVA_CLIENT_ID } = require('./config');

const authorizeStrava = (req, res) => {
  const scopes = 'activity:read_all,activity:write';
  const clientId = STRAVA_CLIENT_ID;
  const redirectURI = 'http://localhost';

  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURI(redirectURI)}&response_type=code&scope=${scopes}`;

  res.redirect(url);
};

module.exports = authorizeStrava;
