const fetch = require('node-fetch');
const { DARKSKY_KEY } = require('./config');

const getWeatherConditions = (latitude, longitude, time) => {
  const url = `https://api.darksky.net/forecast/${DARKSKY_KEY}/${latitude},${longitude},${time}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .catch(err => console.log(err));
}

module.exports = getWeatherConditions;
