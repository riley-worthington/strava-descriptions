const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');

const authorizeStrava = require('./authorizeStrava');
const getActivity = require('./getActivity');
const getStravaAccessToken = require('./getStravaAccessToken');
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

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const { object_type, aspect_type, object_id, owner_id } = req.body;

  if (object_type === 'activity' && aspect_type === 'create') {
    let accessToken;
    getStravaAccessToken(owner_id)
      .then(token => {
        accessToken = token;
        return getActivity(object_id, token);
      })
      .then(activity => {
        const { start_latitude, start_longitude, start_date } = activity;
        const start_time = Math.floor(Date.parse(start_date) / 1000);
        return getWeatherConditions(start_latitude, start_longitude, start_time);
      })
      .then(weather => {
        const { icon, temperature } = weather.currently;
        const updateString = buildDescription(icon, temperature);
        return updateDescription(object_id, accessToken, updateString);
      })
      .catch(err => console.log(err));
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
