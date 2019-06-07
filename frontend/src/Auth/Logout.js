import React from 'react';
import Cookies from 'js-cookie';
import history from '../history';

const Logout = () => {
  localStorage.removeItem('athlete');
  localStorage.removeItem('stravaAccessToken');
  localStorage.removeItem('spotifyAccessToken');
  sessionStorage.removeItem('stateParam');
  Cookies.remove('stateParam');
  history.push('/');
  return (
    <div></div>
  );
};

export default Logout;
