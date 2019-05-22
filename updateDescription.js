const fetch = require('node-fetch');

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

module.exports = updateDescription;
