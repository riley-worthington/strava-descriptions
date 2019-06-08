const db = require('./db');

const getSettings = athleteID => {
  const queryString = `SELECT wants_weather, wants_music, spotify_refresh_token FROM auth WHERE strava_athlete_id = ${athleteID}`;
  return db.query(queryString)
    .then(res => {
      const {
        wants_weather: wantsWeather,
        wants_music: wantsMusic,
        spotify_refresh_token: spotifyRefreshToken,
      } = res.rows[0];
      return {
        wantsWeather,
        wantsMusic,
        hasAuthorizedSpotify: !!spotifyRefreshToken,
      };
    })
    .catch(error => console.log(error));
};

module.exports = getSettings;
