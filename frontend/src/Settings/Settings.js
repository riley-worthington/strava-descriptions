import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import CheckboxItem from '../Setup/CheckboxItem';
import BallLoader from '../widgets/BallLoader';
import Page from '../Page/Page';
import history from '../history';
import withWaitForImages from '../images/withWaitForImages';
import { setNewStateParam } from '../Auth/authHelpers';
import { getAthleteSettings, updateAthleteSettings } from './athleteSettings';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';
import './Settings.css';

const initialState = {
  isLoading: true,
  isUpdatingSettings: false,
  isWeatherSelected: true,
  isMusicSelected: true,
  isSpotifyAuthorized: false,
  isSyncingWeather: null,
  isSyncingMusic: null,
  isError: false,
}

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_SETTINGS':
      const { wantsWeather, wantsMusic, hasAuthorizedSpotify } = action.payload;
      return {
        ...state,
        isWeatherSelected: wantsWeather,
        isSyncingWeather: wantsWeather,
        isMusicSelected: wantsMusic,
        isSyncingMusic: wantsMusic,
        isSpotifyAuthorized: hasAuthorizedSpotify,
        isLoading: false,
      }
    case 'GET_SETTINGS_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'TOGGLE_WEATHER':
      return {
        ...state,
        isWeatherSelected: !state.isWeatherSelected,
      }
    case 'TOGGLE_MUSIC':
      return {
        ...state,
        isMusicSelected: !state.isMusicSelected,
      }
    case 'UPDATE_SETTINGS_INIT':
      return {
        ...state,
        isUpdatingSettings: true,
      }
    case 'UPDATE_SETTINGS_SUCCESS':
      return {
        ...state,
        isUpdatingSettings: false,
      }
    case 'UPDATE_SETTINGS_FAILURE':
      return {
        ...state,
        isUpdatingSettings: false,
      }
    default:
      return state;
  }
}

const Settings = ({ athlete, imageSources }) => {
  const athleteID = athlete.id;
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    let didCancel = false;

    getAthleteSettings(athleteID)
      .then(settings => !didCancel && dispatch({ type: 'INITIALIZE_SETTINGS', payload: settings }))
      .catch(err => !didCancel && dispatch({ type: 'GET_SETTINGS_FAILURE' }));

    return () => {
      didCancel = true;
    };
  }, [athleteID]);

  const toggleSelect = event => {
    if (event.target.id === 'weather') {
      dispatch({ type: 'TOGGLE_WEATHER' });
    } else if (event.target.id === 'spotify') {
      dispatch({ type: 'TOGGLE_MUSIC' });
    }
  }

  const onSubmit = event => {
    const { isWeatherSelected, isMusicSelected, isSpotifyAuthorized } = state;
    event.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS_INIT' });
    updateAthleteSettings(athleteID, isWeatherSelected, isMusicSelected)
      .then(() => {
        dispatch({ type: 'UPDATE_SETTINGS_SUCCESS' });
        if (isMusicSelected && !isSpotifyAuthorized) {
          const stateParam = setNewStateParam();
          const scope = 'user-read-recently-played';

          window.location.assign(`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`);
        } else {
          history.push('/dashboard');
        }
      })
      .catch(err => {
        dispatch({ type: 'UPDATE_SETTINGS_FAILURE' });
        console.log(err);
      });
  }

  const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';

  const {
    isSyncingWeather,
    isSyncingMusic,
    isWeatherSelected,
    isMusicSelected,
    isLoading,
    isUpdatingSettings,
    isError,
  } = state;

  const shouldDisableButton = (isSyncingWeather === isWeatherSelected) && (isSyncingMusic === isMusicSelected);

  const outLinks = [
    {
      href: '/dashboard',
      title: 'Dashboard',
    },
    {
      href: '/about',
      title: 'About',
    },
    {
      href: '/logout',
      title: 'Log out',
    },
  ];

  let body;
  if (isError) {
    body = (
      <div className='loading-box'>
        <h3>Couldn't get settings.</h3>
      </div>
    );
  } else if (isUpdatingSettings) {
    body = (
      <div className='loading-box'>
        <BallLoader id='black'/>
        <h3 className='authorizing'>Updating your settings</h3>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div className='loading-box'>
        <BallLoader id='black'/>
      </div>
    );
  } else {
    body = (
      <Fragment>
        <h2 className='page-title'>Settings</h2>
        <h3 className='setting-description'>What should Tiempo put in your descriptions?</h3>
        <span className='more-info' data-tip={infoMessage}>How does this work?</span>
        <ReactTooltip className='tooltip' place='top' effect='solid' event='click' globalEventOff='click'/>
        <form className='tiempo-options'>
          <CheckboxItem id='weather' text='Weather conditions' defaultChecked={isSyncingWeather} onChange={toggleSelect} />
          <CheckboxItem id='spotify' text='Music you listened to' defaultChecked={isSyncingMusic} onChange={toggleSelect} />
        </form>
        <button className='submit-button' onClick={onSubmit} disabled={shouldDisableButton}>Save</button>
      </Fragment>
    );
  }

  return (
    <Page athlete={athlete} outLinks={outLinks}>
      <div className='settings-page'>
        {body}
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
