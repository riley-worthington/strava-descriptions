import React from 'react';
import history from '../history';
import { removeStoredStateParam } from './authHelpers';

const Logout = () => {
  localStorage.removeItem('athlete');
  localStorage.removeItem('stravaAccessToken');
  localStorage.removeItem('spotifyAccessToken');
  removeStoredStateParam();
  history.push('/');
  return (
    <div></div>
  );
};

export default Logout;
