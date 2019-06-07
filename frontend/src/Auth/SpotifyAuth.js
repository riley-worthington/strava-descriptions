import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import history from '../history';
import './StravaAuth.css';
import { SPOTIFY_REDIRECT_URI, API_URL } from '../config';
import BallLoader from '../BallLoader/BallLoader';


class SpotifyAuth extends Component {

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const stateParam = urlParams.get('state');
      const sessionState = sessionStorage.getItem('stateParam') || Cookies.get('stateParam');
      const { athlete } = this.props;

      if (sessionState === stateParam && athlete != null) {
        const athleteID = athlete.id;
        // fetch to backend for token
        fetch(`${API_URL}/auth/spotify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            athleteID,
            code,
            redirectURI: SPOTIFY_REDIRECT_URI,
          })
        })
        .then(res => res.json())
        .then(res => {
          const { spotifyAccessToken } = res;
          localStorage.setItem('spotifyAccessToken', JSON.stringify(spotifyAccessToken));
          history.replace('/dashboard');
        })
        .catch(err => console.log(err));
      } else {
        console.log('invalid state param');
        history.replace('/dashboard');
      }
    }
  }

  render() {

    return (
      <div className="auth-loading-page">
        <BallLoader id='spotify'/>
        <h1 className="authorizing">Authorizing Spotify</h1>
      </div>
    );
  }
}

SpotifyAuth.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  })
}

export default SpotifyAuth;
