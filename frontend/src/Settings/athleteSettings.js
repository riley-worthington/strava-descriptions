import { API_URL } from '../config';

export const getAthleteSettings = athleteID => {
  return fetch(`${API_URL}/settings/${athleteID}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err));
}

export const updateAthleteSettings = (athleteID, wantsWeather, wantsMusic) => {
  return fetch(`${API_URL}/settings/${athleteID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wantsWeather,
      wantsMusic,
    })
  })
    .then(res => {
      return res;
    })
    .catch(err => console.log(err));
}
