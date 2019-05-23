const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');

const authorizeStrava = require('./authorizeStrava');
const getActivity = require('./getActivity');
const getStravaAccessToken = require('./getStravaAccessToken');
const getSpotifyAccessToken = require('./getSpotifyAccessToken');
const getSpotifyRecentlyPlayed = require('./getSpotifyRecentlyPlayed');
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
  const { start_latitude, start_longitude, start_date } = stravaActivity;

  // Weather
  const epochStartTimeMS = Date.parse(start_date);
  const epochStartTime = Math.floor(epochStartTimeMS / 1000);
  const weather = await getWeatherConditions(start_latitude, start_longitude, epochStartTime);

  // Spotify
  const spotifyToken = await getSpotifyAccessToken(ownerId);
  const spotifyHistory = await getSpotifyRecentlyPlayed(epochStartTimeMS, spotifyToken);
  console.log(spotifyHistory);

  // Description
  const { icon, temperature } = weather.currently;
  const updateString = buildDescription(icon, temperature);
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
