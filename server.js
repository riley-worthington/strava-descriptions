const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');

const authorizeStrava = require('./authorizeStrava');
const getActivity = require('./getActivity');
const getStravaAccessToken = require('./getStravaAccessToken');
const getSpotifyAccessToken = require('./getSpotifyAccessToken');
const getSpotifyRecentlyPlayed = require('./getSpotifyRecentlyPlayed');
const getSongsPlayedDuringActivity = require('./getSongsPlayedDuringActivity');
const getWeatherConditions = require('./getWeatherConditions');
const buildDescription = require('./buildDescription');
const updateDescription = require('./updateDescription');

const { PORT } = require('./config');


const app = express();

app.use(bodyParser.json());

app.get('/login', authorizeStrava);

app.get('/subscription', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
})

async function handleWebhookEvent(objectId, ownerId) {
  // Strava
  const stravaToken = await getStravaAccessToken(ownerId);
  const stravaActivity = await getActivity(objectId, stravaToken);
  const { start_latitude, start_longitude, start_date, elapsed_time } = stravaActivity;
  const epochStartTimeMS = Date.parse(start_date);
  const epochStartTime = Math.floor(epochStartTimeMS / 1000);

  // Weather
  const weather = (start_latitude && start_longitude) ? await getWeatherConditions(start_latitude, start_longitude, epochStartTime) : null;

  // Spotify
  const spotifyToken = await getSpotifyAccessToken(ownerId);
  const spotifyHistory = await getSpotifyRecentlyPlayed(epochStartTimeMS, spotifyToken);
  const epochEndTimeMS = epochStartTimeMS + (elapsed_time * 1000);
  const duringActivity = getSongsPlayedDuringActivity(spotifyHistory.items, epochStartTimeMS, epochEndTimeMS);
  let tracks = duringActivity.map(item => item.track).reverse();

  // Description
  let updateString;
  if (weather) {
    const { icon, temperature } = weather.currently;
    updateString = buildDescription(icon, temperature, tracks);
  } else {
    updateString = buildDescription(null, null, tracks);
  }

  return updateDescription(objectId, stravaToken, updateString);
}

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const { object_type, aspect_type, object_id, owner_id } = req.body;

  if (object_type === 'activity' && aspect_type === 'create') {
    handleWebhookEvent(object_id, owner_id)
      .then(console.log('Successfully updated description of activity ' + object_id))
      .catch(error => console.log(error));
  }
})

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

const port = PORT || 8000;

app.listen(port, () => {
  console.log(emoji.get('satellite_antenna') + '  Listening on port ' + port);
});
