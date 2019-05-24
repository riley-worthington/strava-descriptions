const emoji = require('node-emoji');

const weatherToEmoji = icon => {
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
  }
  return '';
};

const makePlaylist = tracks => {
  // returns a string of readable song info
  const playlist = [];
  for (let i = 0; i < tracks.length; i += 1) {
    const track = tracks[i];
    const artists = (track.artists).map(a => a.name);
    const artistList = artists.join(', ');

    playlist.push(`${track.name} - ${artistList}`);
  }
  return playlist.join('\n');
};

const buildDescription = ({ icon, temperature }, tracks) => {
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
  };

  let weather = '';
  if (icon && temperature) {
    let skyProfile;
    if (icon in iconToDesc) {
      skyProfile = iconToDesc[icon];
    } else {
      const spaced = icon.replace('-', ' ');
      skyProfile = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    }
    const weatherEmoji = weatherToEmoji(icon);

    weather = `${Math.round(temperature)} °F, ${skyProfile} ${weatherEmoji}`;
  }

  let playlist = '';
  if (tracks.length > 0) {
    playlist = makePlaylist(tracks);
  }

  if (weather && playlist) {
    return `${weather}\n\n${playlist}`;
  }
  if (weather) {
    return weather;
  }
  if (playlist) {
    return playlist;
  }
  return '';
};

module.exports = buildDescription;
