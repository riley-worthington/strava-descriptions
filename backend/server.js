const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');
const cors = require('cors');

const authorizeStrava = require('./authorizeStrava');
const authorizeSpotify = require('./authorizeSpotify');
const handleWebhookEvent = require('./handleWebhookEvent').default;
const updateSettings = require('./updateSettings');
const getSettings = require('./getSettings');

const { PORT } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/subscription', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
});

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const {
    object_type: objectType,
    aspect_type: aspectType,
    object_id: objectId,
    owner_id: ownerId,
  } = req.body;

  if (objectType === 'activity' && aspectType === 'create') {
    handleWebhookEvent(objectId, ownerId)
      .then((message) => console.log(message))
      .catch((error) => {
        console.log('Something went wrong');
        console.log(error);
      })
      .finally(console.log());
  }
});

app.post('/auth/strava', (req, res) => {
  const { code } = req.body;
  authorizeStrava(code)
    .then((data) => res.send(JSON.stringify(data)))
    .catch((error) => console.log(error));
});

app.post('/auth/spotify', (req, res) => {
  const { athleteID, code, redirectURI } = req.body;
  authorizeSpotify(athleteID, code, redirectURI)
    .then((data) => res.send(JSON.stringify(data)))
    .catch((error) => console.log(error));
});

// app.put('/settings/:id', (req, res) => {
//   const athleteID = req.params.id;
//   const { wantsWeather, wantsMusic } = req.body;
//   updateSettings(athleteID, wantsWeather, wantsMusic)
//     .then(() => {
//       console.log('Updated settings');
//       res.sendStatus(200);
//     })
//     .catch(error => console.log(error));
// });

app.post('/settings/:id', (req, res) => {
  const athleteID = req.params.id;
  const { changes } = req.body;
  console.log(changes);
  updateSettings(athleteID, changes)
    .then(() => {
      console.log(`Updated settings ${changes}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/settings/:id', (req, res) => {
  const athleteID = req.params.id;
  getSettings(athleteID)
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((error) => console.log(error));
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

const port = PORT || 8000;

app.listen(port, () => {
  console.log(`${emoji.get('satellite_antenna')}  Listening on port ${port}`);
});
