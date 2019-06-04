const db = require('./db');

const getSettings = athleteID => {
  const queryString = `SELECT wants_weather, wants_music FROM auth WHERE strava_athlete_id = ${athleteID}`;
  return db.query(queryString)
    .then(res => {
      const {
        wants_weather: wantsWeather,
        wants_music: wantsMusic,
      } = res.rows[0];
      return {
        wantsWeather,
        wantsMusic,
      };
    })
    .catch(error => console.log(error));
};

module.exports = getSettings;
