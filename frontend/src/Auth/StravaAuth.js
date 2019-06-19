import React, { Component } from 'react';
import history from '../history';
import { API_URL } from '../config';
import BallLoader from '../widgets/BallLoader';
import { getStoredStateParam } from './authHelpers';
import './AuthScreen.css';

class StravaAuth extends Component {
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    if (error) {
      history.replace('/');
    }

    if (code) {
      const stateParam = urlParams.get('state');
      const sessionState = getStoredStateParam();
      if (sessionState === stateParam) {
        // fetch to backend for token
        fetch(`${API_URL}/auth/strava`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
          }),
        })
          .then(res => res.json())
          .then((res) => {
            const { stravaAccessToken, athlete, isFirstTime } = res;
            localStorage.setItem('athlete', JSON.stringify(athlete));
            localStorage.setItem('stravaAccessToken', JSON.stringify(stravaAccessToken));
            if (isFirstTime) {
              history.replace('/setup');
            } else {
              history.replace('/dashboard');
            }
          })
          .catch((err) => {
            console.log(err);
            history.replace('/');
          });
      } else {
        console.log('invalid state param');
        history.replace('/');
      }
    }
  }

  render() {
    return (
      <div className='auth-loading-page'>
        <BallLoader id='strava' />
        <h1 className='authorizing'>Authorizing Strava</h1>
      </div>
    );
  }
}

export default StravaAuth;
