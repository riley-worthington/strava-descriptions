const emoji = require('node-emoji');

const weatherToEmoji = (icon) => {
  const iconToEmoji = {
    'clear-day': 'sunny',
    'clear-night': 'new_moon_with_face',
    'rain': 'rain_cloud',
    'snow': 'snowflake',
    'sleet': 'snow_cloud',
    'wind': 'wind_blowing_face',
    'fog': 'fog',
    'cloudy': 'cloud',
    'partly-cloudy-day': 'partly_sunny',
    'partly-cloudy-night': 'cloud',
  };

  if (icon in iconToEmoji) {
    return emoji.get(iconToEmoji[icon]);
  } else {
    return '';
  }

}

const buildDescription = (icon, temperature) => {
  const iconToDesc = {
    'clear-day': 'Clear',
    'clear-night': 'Clear',
    'rain': 'Rain',
    'snow': 'Snow',
    'sleet': 'Sleet',
    'wind': 'Wind',
    'fog': 'Fog',
    'cloudy': 'Cloudy',
    'partly-cloudy-day': 'Partly Cloudy',
    'partly-cloudy-night': 'Partly Cloudy',
  }

  let weather;
  if (icon in iconToDesc) {
    weather = iconToDesc[icon];
  } else {
    let spaced = icon.replace('-', ' ');
    weather = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }
  const emoji = weatherToEmoji(icon);

  return `${Math.round(temperature)} °F, ${weather} ${emoji}`;

}

module.exports = buildDescription;
