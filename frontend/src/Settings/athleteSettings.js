import { API_URL } from '../config';

export const getAthleteSettings = athleteID => fetch(`${API_URL}/settings/${athleteID}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .catch(err => {
    console.log(err);
    throw Error('Failed to fetch athlete settings.');
  });

export const updateAthleteSettings = (athleteID, changes) => fetch(`${API_URL}/settings/${athleteID}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    changes,
  }),
}).catch(err => {
  console.log(err);
  // throw Error('Failed to update athlete settings.');
});
