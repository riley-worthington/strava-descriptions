const db = require('./db');

const getSettingsAndTokens = athleteID => {
  const queryString = `SELECT * FROM auth WHERE strava_athlete_id = ${athleteID};`;
  return db.query(queryString)
    .then(res => res.rows[0])
    .catch(err => {
      console.log(`Failed to get user info from database: ${err}`);
      return null;
    });
};

module.exports = getSettingsAndTokens;
