require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authorizeStrava = require('./authorizeStrava');
const getActivity = require('./getActivity');

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
  const { object_type, aspect_type, object_id } = req.body;
  console.log(object_type, aspect_type, object_id);

  if (object_type === 'activity' && aspect_type === 'create') {
    // GET activity from Strava api
    const accessToken = process.env.STRAVA_AUTH_TOKEN;  // Need Strava Auth
    const activity = getActivity(object_id, accessToken);
    console.log(activity);
  }



})

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
