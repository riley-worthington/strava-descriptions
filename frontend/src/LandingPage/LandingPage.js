import React from 'react';
import history from '../history';
import { STRAVA_REDIRECT_URI, STRAVA_CLIENT_ID } from '../config';
import { setNewStateParam } from '../Auth/authHelpers';
import ConnectWithStrava from './btn_strava_connectwith_orange.svg';
import CompatibleWithStrava from './api_logo_cptblWith_strava_horiz_light.svg';
import './LandingPage.css';

const LandingPage = () => {
  const athlete = localStorage.getItem('athlete');
  const stateParam = athlete ? history.replace('/dashboard') : setNewStateParam();

  const scope = 'activity:read_all,activity:write';
  const stravaAuthLink = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${STRAVA_REDIRECT_URI}&response_type=code&scope=${scope}&state=${stateParam}`;

  return (
    <div className='landing-page'>
      <header className='landing-header'>
        <h1 className='site-title'>TIEMPO</h1>
      </header>
      <main>
        <div className='info'>
          <h2 className='tagline'>
            Weather conditions and tunes, delivered to your Strava activities.
          </h2>
        </div>
        <a className='strava-auth' href={stravaAuthLink}>
          <img src={ConnectWithStrava} alt='Connect with Strava' />
        </a>
      </main>
      <footer>
        <img
          src={CompatibleWithStrava}
          alt='Compatible with Strava'
          className='api-logo'
        />
      </footer>
    </div>
  );
};

export default LandingPage;
