import React, { Component } from 'react';
import history from '../history';
import './StravaAuth.css';
import { API_URL } from '../config';

class StravaAuth extends Component {

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const stateParam = urlParams.get('state');
      const sessionState = sessionStorage.getItem('stateParam');
      if (sessionState === stateParam) {
        // fetch to backend for token
        fetch(`${API_URL}/auth/strava`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code,
          })
        })
        .then(res => res.json())
        .then(res => {
          const { athlete, stravaAccessToken } = res;
          localStorage.setItem('athlete', JSON.stringify(athlete));
          localStorage.setItem('stravaAccessToken', JSON.stringify(stravaAccessToken));
          history.push('/dashboard');
        })
        .catch(err => {
          console.log(err);
          history.push('/');
        });
      } else {
        console.log('invalid state param');
        history.push('/');
      }
    }
  }

  render() {

    return (
      <div className="auth-loading-page">
        <h1 className="authorizing">Authorizing Strava</h1>
        <div className="lds-dual-ring"></div>
      </div>
    );
  }
}

export default StravaAuth;
