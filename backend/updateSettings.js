const db = require('./db');

const updateSettings = (athleteID, wantsWeather, wantsMusic) => {
  // update
  console.log(athleteID, wantsWeather, wantsMusic);
  const queryString = `UPDATE auth SET wants_weather = ${wantsWeather}, wants_music = ${wantsMusic} WHERE strava_athlete_id = ${athleteID}`;

  return db.query(queryString);
};

module.exports = updateSettings;
