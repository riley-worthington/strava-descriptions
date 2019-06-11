const fetch = require('node-fetch');

const getActivity = (activityId, accessToken) => {
  const url = `https://www.strava.com/api/v3/activities/${activityId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res;
    })
    .then(res => res.json())
    .catch(err => {
      console.log(`Problem getting Strava activity: ${err}`);
      return null;
    });
};

module.exports = getActivity;
