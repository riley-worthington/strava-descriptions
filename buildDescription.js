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

const makePlaylist = tracks => {
  // returns a string of readable song info
  let playlist = [];
  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    let artists = (track.artists).map(a => a.name);
    let artistList = artists.join(', ');

    playlist.push(`${track.name} - ${artistList}`);
  }
  return playlist.join('\n');
}

const buildDescription = ({icon, temperature}, tracks) => {
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

  let weather = '';
  if (icon && temperature) {
    let skyProfile;
    if (icon in iconToDesc) {
      skyProfile = iconToDesc[icon];
    } else {
      let spaced = icon.replace('-', ' ');
      skyProfile = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    }
    const emoji = weatherToEmoji(icon);

    weather = `${Math.round(temperature)} °F, ${skyProfile} ${emoji}`;
  }

  let playlist = '';
  if (tracks.length > 0) {
    playlist = makePlaylist(tracks);
  }

  if (weather && playlist) {
    return `${weather}\n\n${playlist}`;
  } else if (weather) {
    return weather;
  } else if (playlist) {
    return playlist;
  } else {
    return '';
  }

}

module.exports = buildDescription;
