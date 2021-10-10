const getActivity = require('./getActivity');
const {
  isStravaTokenValid,
  refreshStravaToken,
} = require('./getStravaAccessToken');
const refreshSpotifyToken = require('./refreshSpotifyToken');
const getSpotifyRecentlyPlayed = require('./getSpotifyRecentlyPlayed');
const getSongsPlayedDuringActivity = require('./getSongsPlayedDuringActivity');
const getWeatherConditions = require('./getWeatherConditions');
const buildDescription = require('./buildDescription');
const updateDescription = require('./updateDescription');
const getSettingsAndTokens = require('./getSettingsAndTokens');

// eslint-disable-next-line import/prefer-default-export
const putDescriptionAndUpdateStringTogether = (description, updateString) => {
  if (description && updateString) {
    if (description.includes(updateString)) {
      // we have already updated the description, don't need to do anything
      return description;
    }
    return `${description}\n\n${updateString}`;
  }
  if (description) {
    return description;
  }
  if (updateString) {
    return updateString;
  }
  return '';
};

async function getSpotifyTracks(
  spotifyToken,
  epochStartTimeMS,
  epochEndTimeMS
) {
  const spotifyHistory = await getSpotifyRecentlyPlayed(
    epochStartTimeMS,
    spotifyToken
  );
  const duringActivity = getSongsPlayedDuringActivity(
    spotifyHistory.items,
    epochStartTimeMS,
    epochEndTimeMS
  );
  const tracks = duringActivity.map((item) => item.track).reverse();
  return tracks;
}

const handleWebhookEvent = async (activityID, athleteID) => {
  try {
    const userInfo = await getSettingsAndTokens(athleteID);
    const {
      strava_expires_at: stravaExpiresAt,
      strava_refresh_token: stravaRefreshToken,
      spotify_refresh_token: spotifyRefreshToken,
      wants_weather: wantsWeather,
      wants_music: wantsMusic,
    } = userInfo;
    let { strava_access_token: stravaAccessToken } = userInfo;

    if (!wantsWeather && !wantsMusic) {
      return Promise.resolve(`User doesn't want to sync weather or music.`);
    }

    // Get a fresh Spotify token if they want music
    const spotifyTokenPromise = wantsMusic
      ? refreshSpotifyToken(spotifyRefreshToken, athleteID)
      : Promise.resolve(null);

    // Refresh Strava token if necessary and get the activity
    if (!isStravaTokenValid(stravaExpiresAt)) {
      stravaAccessToken = await refreshStravaToken(
        stravaRefreshToken,
        athleteID
      );
    }
    const stravaActivity = await getActivity(activityID, stravaAccessToken);
    const {
      start_latitude: startLatitude,
      start_longitude: startLongitude,
      start_date: startDate,
      elapsed_time: elapsedTime,
      description,
    } = stravaActivity;
    if (!startDate) {
      return Promise.resolve(
        `Activity doesn't have a start time. Can't get weather/music info.`
      );
    }
    const epochStartTimeMS = Date.parse(startDate);
    const epochStartTime = Math.floor(epochStartTimeMS / 1000);

    // Weather
    if ((!startLatitude || !startLongitude) && wantsWeather) {
      console.log(
        `User wants weather but this activity doesn't have a location.`
      );
    }
    const weatherPromise =
      wantsWeather && startLatitude && startLongitude
        ? getWeatherConditions(startLatitude, startLongitude, epochStartTime)
        : Promise.resolve({
            icon: null,
            temperature: null,
          });

    // Spotify
    const spotifyToken = await spotifyTokenPromise;
    const epochEndTimeMS = epochStartTimeMS + elapsedTime * 1000;
    const spotifyTracksPromise =
      wantsMusic && spotifyToken
        ? getSpotifyTracks(spotifyToken, epochStartTimeMS, epochEndTimeMS)
        : Promise.resolve(null);

    const [weather, tracks] = await Promise.all([
      weatherPromise,
      spotifyTracksPromise,
    ]);

    const updateString = buildDescription(weather, tracks);
    return updateDescription(
      activityID,
      stravaAccessToken,
      putDescriptionAndUpdateStringTogether(description, updateString)
    );
  } catch (error) {
    return Promise.reject(Error(error));
  }
};

module.exports = {
  default: handleWebhookEvent,
  putDescriptionAndUpdateStringTogether,
};
