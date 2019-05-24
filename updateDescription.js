const fetch = require('node-fetch');

const updateDescription = (activityId, accessToken, updateString) => {
  if (updateString === '') {
    return Promise.reject(Error('Nothing to update'));
  }

  const url = `https://www.strava.com/api/v3/activities/${activityId}`;
  const data = { description: updateString };

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res;
    })
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      throw Error('Failed to update description.');
    });
};

module.exports = updateDescription;
