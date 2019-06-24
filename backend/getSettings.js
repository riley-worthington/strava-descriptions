const db = require('./db');

const getSettings = athleteID => {
  const queryString = `SELECT wants_weather, wants_music, spotify_refresh_token, temp_units, distance_units, weather_format_string, music_format_string FROM auth WHERE strava_athlete_id = ${athleteID}`;
  return db.query(queryString)
    .then(res => {
      const {
        wants_weather: wantsWeather,
        wants_music: wantsMusic,
        spotify_refresh_token: spotifyRefreshToken,
        temp_units: tempUnits,
        distance_units: distanceUnits,
        weather_format_string: weatherFormatString,
        music_format_string: musicFormatString,
      } = res.rows[0];
      return {
        wantsWeather,
        wantsMusic,
        hasAuthorizedSpotify: !!spotifyRefreshToken,
        tempUnits,
        distanceUnits,
        weatherFormatString,
        musicFormatString,
      };
    })
    .catch(error => console.log(error));
};

module.exports = getSettings;
