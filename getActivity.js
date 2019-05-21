const fetch = require('node-fetch');

const getActivity = (activityId, accessToken) => {
  const url = `https://www.strava.com/api/v3/activities/${activityId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => console.log(error));
};

module.exports = getActivity;
