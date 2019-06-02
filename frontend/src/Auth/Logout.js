import React from 'react';
import history from '../history';

const Logout = () => {
  localStorage.removeItem('athlete');
  localStorage.removeItem('stravaAccessToken');
  localStorage.removeItem('spotifyAccessToken');
  sessionStorage.removeItem('stateParam');
  history.push('/');
  return (
    <div></div>
  );
};

export default Logout;
