
const authorizeStrava = (req, res) => {
  const scopes = 'activity:read_all,activity:write';
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;

  const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURI(redirect_uri)}&response_type=code&scope=${scopes}`;

  res.redirect(url);
}

module.exports = authorizeStrava;
