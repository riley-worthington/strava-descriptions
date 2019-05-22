require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const authorizeStrava = require('./authorizeStrava');
const getActivity = require('./getActivity');
const fetch = require('node-fetch');

const app = express();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

app.use(bodyParser.json());

app.get('/login', authorizeStrava);

app.get('/subscription', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
})

const updateStravaToken = (refresh_token, athlete_id) => {
  console.log('Updating token');
  const url = `https://www.strava.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refresh_token}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      const { access_token, expires_at, refresh_token } = res;
      // update database here
      return client.query(`UPDATE auth SET strava_access_token = '${access_token}', strava_expires_at = ${expires_at}, strava_refresh_token = '${refresh_token}' WHERE strava_athlete_id = ${athlete_id} RETURNING strava_access_token;`);
    })
    .then(res => res.rows[0]['strava_access_token'])
    .catch(error => console.log(error));
}


const getStravaAccessToken = (athlete_id) => {
  console.log('getting token');
  return client.query(`SELECT strava_access_token, strava_expires_at, strava_refresh_token FROM auth WHERE strava_athlete_id = ${athlete_id};`)
    .then(res => {
      const authInfo = res.rows[0];
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(authInfo['strava_expires_at'], currentTime);
      if (authInfo['strava_expires_at'] - currentTime < 3600) {
        // get new access token from Strava using refresh token
        const refresh_token = authInfo['strava_refresh_token'];
        return updateStravaToken(refresh_token, athlete_id);
      } else {
        return authInfo['strava_access_token'];
      }

    });
}

const getWeatherConditions = (latitude, longitude, time) => {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude},${time}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .catch(err => console.log(err));
}

const updateDescription = (activityId, accessToken, updateString) => {
  const url = `https://www.strava.com/api/v3/activities/${activityId}`;
  const data = { 'description': updateString };

  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .catch(err => console.log(err));
}

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const { object_type, aspect_type, object_id, owner_id } = req.body;
  console.log(object_type, aspect_type, object_id);

  if (object_type === 'activity' && aspect_type === 'create') {
    // GET activity from Strava api
    let accessToken;
    getStravaAccessToken(owner_id)
      .then(token => {
        accessToken = token;
        return getActivity(object_id, token);
      })
      .then(activity => {
        const { start_latitude, start_longitude, start_date_local } = activity;
        const start_time = Math.floor(Date.parse(start_date_local) / 1000);
        return getWeatherConditions(start_latitude, start_longitude, start_time);
      })
      .then(weather => {
        const { icon } = weather.currently;
        return updateDescription(object_id, accessToken, icon);
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
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
