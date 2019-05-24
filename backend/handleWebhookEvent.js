const getActivity = require('./getActivity');
const getStravaAccessToken = require('./getStravaAccessToken');
const getSpotifyAccessToken = require('./getSpotifyAccessToken');
const getSpotifyRecentlyPlayed = require('./getSpotifyRecentlyPlayed');
const getSongsPlayedDuringActivity = require('./getSongsPlayedDuringActivity');
const getWeatherConditions = require('./getWeatherConditions');
const buildDescription = require('./buildDescription');
const updateDescription = require('./updateDescription');

async function getSpotifyTracks(
  spotifyToken,
  epochStartTimeMS,
  epochEndTimeMS,
) {
  const spotifyHistory = await getSpotifyRecentlyPlayed(epochStartTimeMS, spotifyToken);
  const duringActivity = getSongsPlayedDuringActivity(
    spotifyHistory.items, epochStartTimeMS, epochEndTimeMS,
  );
  const tracks = duringActivity.map(item => item.track).reverse();
  return tracks;
}

async function handleWebhookEvent(objectId, ownerId) {
  const spotifyTokenPromise = getSpotifyAccessToken(ownerId);

  // Strava
  const stravaToken = await getStravaAccessToken(ownerId);
  const stravaActivity = await getActivity(objectId, stravaToken);
  const {
    start_latitude: startLatitude,
    start_longitude: startLongitude,
    start_date: startDate,
    elapsed_time: elapsedTime,
  } = stravaActivity;
  const epochStartTimeMS = Date.parse(startDate);
  const epochStartTime = Math.floor(epochStartTimeMS / 1000);

  // Weather
  const weatherPromise = (startLatitude && startLongitude)
    ? getWeatherConditions(startLatitude, startLongitude, epochStartTime)
    : Promise.resolve({
      icon: null,
      temperature: null,
    });

  // Spotify
  const spotifyToken = await spotifyTokenPromise;
  const epochEndTimeMS = epochStartTimeMS + (elapsedTime * 1000);
  const spotifyTracksPromise = getSpotifyTracks(spotifyToken, epochStartTimeMS, epochEndTimeMS);

  const [weather, tracks] = await Promise.all([weatherPromise, spotifyTracksPromise]);

  const updateString = buildDescription(weather, tracks);
  return updateDescription(objectId, stravaToken, updateString);
}

module.exports = handleWebhookEvent;