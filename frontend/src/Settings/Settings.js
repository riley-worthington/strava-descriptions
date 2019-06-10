import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import CheckboxItem from '../Setup/CheckboxItem';
import BallLoader from '../widgets/BallLoader';
import Page from '../Page/Page';
import history from '../history';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';
import withWaitForImages from '../images/withWaitForImages';
import { setNewStateParam } from '../Auth/authHelpers';
import { getAthleteSettings, updateAthleteSettings } from './athleteSettings';
import './Settings.css';

const Settings = ({ athlete, imageSources }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isWeatherSelected, setIsWeatherSelected] = useState(null);
  const [isSpotifySelected, setIsSpotifySelected] = useState(null);
  const [isSpotifyAuthorized, setIsSpotifyAuthorized] = useState(false);
  const [initialWeatherSelected, setInitialWeatherSelected] = useState(null);
  const [initialSpotifySelected, setInitialSpotifySelected] = useState(null);

  useEffect(() => {
    getAthleteSettings(athlete.id)
      .then(settings => {
        const {
          wantsWeather,
          wantsMusic,
          hasAuthorizedSpotify,
        } = settings;
        setIsWeatherSelected(wantsWeather);
        setInitialWeatherSelected(wantsWeather);
        setIsSpotifySelected(wantsMusic);
        setInitialSpotifySelected(wantsMusic);
        setIsSpotifyAuthorized(hasAuthorizedSpotify);
        setIsLoading(false);
      })
  }, [athlete.id]);

  const toggleSelect = event => {
    if (event.target.id === 'weather') {
      setIsWeatherSelected(state => !state);
    } else if (event.target.id === 'spotify') {
      setIsSpotifySelected(state => !state);
    }
  }

  const onSubmit = event => {
    event.preventDefault();
    setIsUpdatingSettings(true);
    updateAthleteSettings(athlete.id, isWeatherSelected, isSpotifySelected)
      .then(() => {
        if (isSpotifySelected && !isSpotifyAuthorized) {
          const stateParam = setNewStateParam();
          const scope = 'user-read-recently-played';

          window.location.assign(`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`);
        } else {
          history.push('/dashboard');
        }
      })
      .catch(err => console.log(err));
  }

  const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';

  const shouldDisableButton = (initialWeatherSelected === isWeatherSelected) && (initialSpotifySelected === isSpotifySelected);

  const outLinks = [
    {
      href: '/dashboard',
      title: 'Dashboard',
    },
    {
      href: '/logout',
      title: 'Log out',
    },
  ];

  return (
    <Page athlete={athlete} outLinks={outLinks}>
      <div className='settings-page'>
        {isLoading
          ? <div className='loading-box'>
              <BallLoader id='black'/>
            </div>
          : (
            <Fragment>
              <h2 className='page-title'>Settings</h2>
              <h3 className='setting-description'>What should Tiempo put in your descriptions?</h3>
              <span className='more-info' data-tip={infoMessage}>How does this work?</span>
              <ReactTooltip className='tooltip' place='top' effect='solid' event='click' globalEventOff='click'/>
              <form className='tiempo-options'>
                <CheckboxItem id='weather' text='Weather conditions' defaultChecked={isWeatherSelected} onChange={toggleSelect} />
                <CheckboxItem id='spotify' text='Music you listened to' defaultChecked={isSpotifySelected} onChange={toggleSelect} />
              </form>
              <button className='submit-button' onClick={onSubmit} disabled={shouldDisableButton}>Save</button>
            </Fragment>
          )}
      </div>
    </Page>
  );
}



Settings.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  })
}

export default withWaitForImages(Settings, ['powered-by-dark-sky-black', 'spotify-logo-green']);
