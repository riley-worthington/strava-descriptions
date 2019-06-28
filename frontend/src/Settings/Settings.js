import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useReducer } from 'react';
import Page from '../Page/Page';
import BallLoader from '../widgets/BallLoader';
import GeneralSettings from './GeneralSettings';
import UnitSettings from './UnitSettings';
import CustomizationSettings from './CustomizationSettings';
import { getAthleteSettings } from './athleteSettings';
import './Settings.css';

const DEFAULT_WEATHER_FORMAT_STRING = '$temp$, $summary$ $emoji$';
const DEFAULT_MUSIC_FORMAT_STRING = '$name$ - $artists$';
const DEFAULT_TEMP_UNITS = 'f';
const DEFAULT_DISTANCE_UNITS = 'mi';

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_SETTINGS': {
      const {
        wantsWeather,
        wantsMusic,
        tempUnits,
        distanceUnits,
        weatherFormatString,
        musicFormatString,
        hasAuthorizedSpotify,
      } = action.payload;
      return {
        ...state,
        isWeatherSelected: wantsWeather,
        isMusicSelected: wantsMusic,
        initialWeatherFormatString: weatherFormatString,
        initialMusicFormatString: musicFormatString,
        tempUnitSelection: tempUnits,
        distanceUnitSelection: distanceUnits,
        isSpotifyAuthorized: hasAuthorizedSpotify,
        isLoading: false,
      };
    }
    case 'GET_SETTINGS_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'UPDATE_SETTINGS_INIT':
      return {
        ...state,
        isUpdatingSettings: true,
      };
    case 'UPDATE_SETTINGS_SUCCESS':
      return {
        ...state,
        isUpdatingSettings: false,
      };
    case 'UPDATE_SETTINGS_FAILURE':
      return {
        ...state,
        isUpdatingSettings: false,
      };
    default:
      return state;
  }
};

const Settings = ({ athlete }) => {
  const athleteID = athlete.id;
  const [state, dispatch] = useReducer(settingsReducer, {
    isLoading: true,
    isUpdatingSettings: false,
    isWeatherSelected: true,
    isMusicSelected: true,
    isSpotifyAuthorized: false,
    isError: false,
    initialWeatherFormatString: DEFAULT_WEATHER_FORMAT_STRING,
    initialMusicFormatString: DEFAULT_MUSIC_FORMAT_STRING,
    tempUnitSelection: DEFAULT_TEMP_UNITS,
    distanceUnitSelection: DEFAULT_DISTANCE_UNITS,
  });

  useEffect(() => {
    let didCancel = false;

    getAthleteSettings(athleteID)
      .then(settings => !didCancel && dispatch({ type: 'INITIALIZE_SETTINGS', payload: settings }))
      .catch(err => !didCancel && dispatch({ type: 'GET_SETTINGS_FAILURE', payload: err }));

    return () => {
      didCancel = true;
    };
  }, [athleteID]);

  const {
    isWeatherSelected,
    isMusicSelected,
    isLoading,
    isUpdatingSettings,
    isError,
  } = state;

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
        <h3>Couldn&apos;t get settings.</h3>
      </div>
    );
  } else if (isUpdatingSettings) {
    body = (
      <div className='loading-box'>
        <BallLoader id='black' />
        <h3 className='authorizing'>Updating your settings</h3>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div className='loading-box'>
        <BallLoader id='black' />
      </div>
    );
  } else {
    body = (
      <Fragment>
        <div className='title-box'>
          <h2 className='settings-page-title'>Settings</h2>
        </div>
        <div className='settings'>
          <form className='settings-form'>
            <div className='settings-block'>
              <h2>General</h2>
              <GeneralSettings
                athleteID={athleteID}
                isSpotifyAuthorized={state.isSpotifyAuthorized}
                initialWeatherSetting={isWeatherSelected}
                initialMusicSetting={isMusicSelected}
              />
            </div>
            <div className='settings-block'>
              <h2>Units</h2>
              <UnitSettings
                athleteID={athleteID}
                initialTempUnits={state.tempUnitSelection}
                initialDistanceUnits={state.distanceUnitSelection}
              />
            </div>
            <div className='settings-block'>
              <h2>Customize</h2>
              <p>
                Type how you would like your descriptions to read. Surround variables with $
                (dollar) signs, e.g.
                {' '}
                <code>
                  $
                  <span style={{ color: '#f71b47' }}>temp</span>
$
                </code>
                . All other text you enter will be printed verbatim.
              </p>
              <CustomizationSettings
                athleteID={athleteID}
                isWeatherSelected={isWeatherSelected}
                isMusicSelected={isMusicSelected}
                initialWeatherFormatString={state.initialWeatherFormatString}
                initialMusicFormatString={state.initialMusicFormatString}
              />
            </div>
          </form>
        </div>
      </Fragment>
    );
  }

  return (
    <Page athlete={athlete} outLinks={outLinks}>
      <div className='settings-page'>{body}</div>
    </Page>
  );
};

Settings.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default Settings;
