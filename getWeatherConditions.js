const fetch = require('node-fetch');
const { DARKSKY_KEY } = require('./config');

const getWeatherConditions = (latitude, longitude, time) => {
  const url = `https://api.darksky.net/forecast/${DARKSKY_KEY}/${latitude},${longitude},${time}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res;
    })
    .then(res => res.json())
    .then(weather => weather.currently)
    .catch(err => {
      console.log(`Problem getting weather (${err})`);
      return {
        icon: null,
        temperature: null,
      };
    });
};

module.exports = getWeatherConditions;
