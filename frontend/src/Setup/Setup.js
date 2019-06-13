import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import CheckboxItem from './CheckboxItem';
import BallLoader from '../widgets/BallLoader';
import history from '../history';
import './Setup.css';
import { API_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';

import { setNewStateParam } from '../Auth/authHelpers';
import loadImages from '../images/loadImages';

class Setup extends Component {
  constructor() {
    super();

    this.state = {
      isWeatherSelected: true,
      isSpotifySelected: true,
      isLoading: true,
      isUpdatingSettings: false,
      imagesLoaded: false,
      imageSources: null,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });

    loadImages(['powered-by-dark-sky-black', 'spotify-logo-green']).then((sources) => {
      this.setState({
        imagesLoaded: true,
        imageSources: sources,
      });
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    const { athlete } = this.props;
    const { isWeatherSelected, isSpotifySelected } = this.state;
    const stravaAthleteID = athlete.id;
    const stateParam = setNewStateParam();
    const scope = 'user-read-recently-played';

    // Talk to Tiempo database
    this.setState({ isUpdatingSettings: true });
    await fetch(`${API_URL}/settings/${stravaAthleteID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wantsWeather: isWeatherSelected,
        wantsMusic: isSpotifySelected,
      }),
    });

    if (isSpotifySelected) {
      window.location.assign(
        `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`,
      );
    } else {
      history.push('/dashboard');
    }
  }

  handleSelect(event) {
    if (event.target.id === 'weather') {
      this.setState(state => ({
        isWeatherSelected: !state.isWeatherSelected,
      }));
    } else if (event.target.id === 'spotify') {
      this.setState(state => ({
        isSpotifySelected: !state.isSpotifySelected,
      }));
    }
  }

  render() {
    const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';
    const { athlete } = this.props;
    const {
      isLoading, isUpdatingSettings, imagesLoaded, imageSources,
    } = this.state;
    const waiting = isLoading || isUpdatingSettings || !imagesLoaded;

    return (
      <div className='setup-page'>
        {waiting ? (
          <div className='loading-box'>
            {isUpdatingSettings && (
              <Fragment>
                <BallLoader id='black' />
                <h1 className='authorizing'>Updating your settings</h1>
              </Fragment>
            )}
          </div>
        ) : (
          <Fragment>
            <header>
              <h1 className='title'>TIEMPO</h1>
            </header>
            <div className='welcome-box fade-in'>
              <p className='welcome-message'>{`Welcome, ${athlete.firstname}!`}</p>
            </div>
            <div className='prompt-box fade-in'>
              <p className='prompt'>
                What information should Tiempo put in your activity descriptions?
              </p>
              <span className='more-info' data-tip={infoMessage}>
                How does this work?
              </span>
              <ReactTooltip
                className='tooltip'
                place='top'
                effect='solid'
                event='click'
                globalEventOff='click'
              />
            </div>
            <div className='box fade-in'>
              <form className='tiempo-options'>
                <CheckboxItem id='weather' text='Weather conditions' onChange={this.handleSelect} />
                <CheckboxItem
                  id='spotify'
                  text='Music you listened to'
                  onChange={this.handleSelect}
                />
              </form>
            </div>
            <p className='hesitant fade-in'>(You can change this at any time)</p>
            <button type='button' className='submit-button fade-in' onClick={this.onSubmit}>
              Let&apos;s Go!
            </button>
            <div className='branding fade-in'>
              <a href='https://darksky.net/poweredby/' target='_blank' rel='noreferrer noopener'>
                <img
                  id='darksky'
                  src={imageSources['powered-by-dark-sky-black']}
                  alt='Powered by DarkSky'
                />
              </a>
              <a
                href='https://www.spotify.com'
                id='spotify-link'
                target='_blank'
                rel='noreferrer noopener'
              >
                <div className='spotify-block'>
                  <span className='provider'>Powered by</span>
                  <img
                    id='spotify'
                    src={imageSources['spotify-logo-green']}
                    alt='Powered by Spotify'
                  />
                </div>
              </a>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

Setup.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default Setup;
