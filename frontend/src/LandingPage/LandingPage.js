import React, { Component } from 'react';
import Cookies from 'js-cookie';
import history from '../history';

import './LandingPage.css';
import { STRAVA_REDIRECT_URI, STRAVA_CLIENT_ID } from '../config';

import { generateRandomString } from '../helpers';

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      stateParam: null,
    };
  }

  componentDidMount() {
    const athlete = localStorage.getItem('athlete');
    if (athlete) {
      history.replace('/dashboard');
    } else {
      const stateParam = generateRandomString(16);
      sessionStorage.setItem('stateParam', stateParam);
      // Cookies for browsers w/o sessionStorage support
      Cookies.set('stateParam', stateParam);
      this.setState({ stateParam });
    }
  }

  render() {
    const scope = 'activity:read_all,activity:write';
    const { stateParam } = this.state;

    return (
      <div className="landing-page">
        <header className="landing-header">
          <h1 className="site-title">TIEMPO</h1>
        </header>
        <main>
          <div className="info">
            <h2 className="tagline">Weather conditions and tunes, delivered to your Strava activities.</h2>
          </div>
          <a className='strava-auth' href={`https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${STRAVA_REDIRECT_URI}&response_type=code&scope=${scope}&state=${stateParam}`}>
            <img src={require("./btn_strava_connectwith_orange.svg")} alt="Connect with Strava"/>
          </a>
        </main>
        <footer>
          <img src={require('./api_logo_cptblWith_strava_horiz_light.svg')} alt="Compatible with Strava" className='api-logo' />
        </footer>
      </div>
    );
  }
}

export default LandingPage;
