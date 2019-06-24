const db = require('./db');

// const updateSettings = (athleteID, wantsWeather, wantsMusic) => {
//   // update
//   console.log(athleteID, wantsWeather, wantsMusic);
//   const queryString = `UPDATE auth SET wants_weather = ${wantsWeather}, wants_music = ${wantsMusic} WHERE strava_athlete_id = ${athleteID}`;

//   return db.query(queryString);
// };

const columnNames = {
  wantsWeather: 'wants_weather',
  wantsMusic: 'wants_music',
  tempUnits: 'temp_units',
  distanceUnits: 'distance_units',
  weatherFormatString: 'weather_format_string',
  musicFormatString: 'music_format_string',
}

const updateSettings = (athleteID, changes) => {
  const changedSettings = Object.entries(changes);

  return Promise.all(
    changedSettings.map(([key, value]) => {
      const val = (typeof value === 'string') ? `'${value}'` : value;
      return db.query(`UPDATE auth SET ${columnNames[key]} = ${val} WHERE strava_athlete_id = ${athleteID}`);
    }),
  );
};

module.exports = updateSettings;
