import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useReducer } from 'react';
import Page from '../Page/Page';
import CustomFormat from './CustomFormat';
import BallLoader from '../widgets/BallLoader';
import { getAthleteSettings, updateAthleteSettings } from './athleteSettings';
import './Settings.css';
import GeneralSettings from './GeneralSettings';

const DEFAULT_WEATHER_FORMAT_STRING = '$temp$, $summary$ $emoji$';
const DEFAULT_MUSIC_FORMAT_STRING = '$name$ - $artists$';

const initialState = {
  isLoading: true,
  isUpdatingSettings: false,
  isWeatherSelected: true,
  isMusicSelected: true,
  isSpotifyAuthorized: false,
  isError: false,
  weatherFormatString: DEFAULT_WEATHER_FORMAT_STRING,
  initialWeatherFormatString: DEFAULT_WEATHER_FORMAT_STRING,
  musicFormatString: DEFAULT_MUSIC_FORMAT_STRING,
  initialMusicFormatString: DEFAULT_MUSIC_FORMAT_STRING,
  tempUnitSelection: 'f',
  distanceUnitSelection: 'mi',
};

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
        weatherFormatString,
        initialWeatherFormatString: weatherFormatString,
        musicFormatString,
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
    case 'SET_IS_WEATHER_SELECTED':
      return {
        ...state,
        isWeatherSelected: action.payload,
      };
    case 'SET_IS_MUSIC_SELECTED':
      return {
        ...state,
        isMusicSelected: action.payload,
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
    case 'UPDATE_WEATHER_FORMAT_STRING':
      return {
        ...state,
        weatherFormatString: action.payload,
      };
    case 'UPDATE_INITIAL_WEATHER_FORMAT_STRING':
      return {
        ...state,
        initialWeatherFormatString: action.payload,
      };
    case 'UPDATE_MUSIC_FORMAT_STRING':
      return {
        ...state,
        musicFormatString: action.payload,
      };
    case 'UPDATE_INITIAL_MUSIC_FORMAT_STRING':
      return {
        ...state,
        initialMusicFormatString: action.payload,
      };
    case 'SET_TEMP_UNITS':
      return {
        ...state,
        tempUnitSelection: action.payload,
      };
    case 'SET_DISTANCE_UNITS':
      return {
        ...state,
        distanceUnitSelection: action.payload,
      };
    default:
      return state;
  }
};

const requestReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLING_TEMP_UNITS':
      return {
        ...state,
        togglingTempUnits: action.payload,
      };
    case 'TOGGLING_DISTANCE_UNITS':
      return {
        ...state,
        togglingDistanceUnits: action.payload,
      };
    default:
      return state;
  }
};

const Settings = ({ athlete }) => {
  const athleteID = athlete.id;
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const [requestsPending, setRequestsPending] = useReducer(requestReducer, {
    togglingTempUnits: false,
    togglingDistanceUnits: false,
    updatingWeatherFormatString: false,
    updatingMusicFormatString: false,
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

  const toggleTempUnits = event => {
    const isPending = requestsPending.togglingTempUnits;
    if (isPending) {
      return;
    }
    setRequestsPending({ type: 'TOGGLING_TEMP_UNITS', payload: true });

    const oldTempUnits = state.tempUnitSelection;
    const newTempUnits = event.target.value;
    dispatch({ type: 'SET_TEMP_UNITS', payload: newTempUnits });
    updateAthleteSettings(athleteID, {
      tempUnits: newTempUnits,
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error('Request failed');
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'SET_TEMP_UNITS', payload: oldTempUnits });
      })
      .finally(() => setRequestsPending({ type: 'TOGGLING_TEMP_UNITS', payload: false }));
  };

  const toggleDistanceUnits = event => {
    const isPending = requestsPending.togglingDistanceUnits;
    if (isPending) {
      return;
    }
    setRequestsPending({ type: 'TOGGLING_DISTANCE_UNITS', payload: true });

    const oldDistanceUnits = state.distanceUnitSelection;
    const newDistanceUnits = event.target.value;
    dispatch({ type: 'SET_DISTANCE_UNITS', payload: newDistanceUnits });
    updateAthleteSettings(athleteID, {
      distanceUnits: newDistanceUnits,
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error('Request failed');
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'SET_DISTANCE_UNITS', payload: oldDistanceUnits });
      })
      .finally(() => setRequestsPending({ type: 'TOGGLING_DISTANCE_UNITS', payload: false }));
  };

  const updateWeatherFormatString = event => {
    dispatch({ type: 'UPDATE_WEATHER_FORMAT_STRING', payload: event.target.value });
  };

  const submitWeatherFormatString = () => {
    const { weatherFormatString } = state;
    updateAthleteSettings(athleteID, {
      weatherFormatString,
    })
      .then(res => {
        if (res.status === 200) {
          console.log('success');
          dispatch({ type: 'UPDATE_INITIAL_WEATHER_FORMAT_STRING', payload: weatherFormatString });
        } else {
          console.log('failed');
        }
      })
      .catch(err => console.log(`Failed ${err}`));
  };

  const updateMusicFormatString = event => {
    dispatch({ type: 'UPDATE_MUSIC_FORMAT_STRING', payload: event.target.value });
  };

  const submitMusicFormatString = () => {
    const { musicFormatString } = state;
    updateAthleteSettings(athleteID, {
      musicFormatString,
    })
      .then(res => {
        if (res.status === 200) {
          console.log('success');
          dispatch({ type: 'UPDATE_INITIAL_MUSIC_FORMAT_STRING', payload: musicFormatString });
        } else {
          console.log('failed');
        }
      })
      .catch(err => console.log(`Failed ${err}`));
  };

  const {
    isWeatherSelected,
    isMusicSelected,
    isLoading,
    isUpdatingSettings,
    isError,
    weatherFormatString,
    initialWeatherFormatString,
    musicFormatString,
    initialMusicFormatString,
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
              <div className='unit-select'>
                <div className='radio-box'>
                  <input
                    className='radio no-mobile-highlight'
                    type='radio'
                    id='f'
                    name='temp'
                    value='f'
                    checked={state.tempUnitSelection === 'f'}
                    onChange={toggleTempUnits}
                  />
                  <label htmlFor='f'>°F</label>
                </div>
                <div className='radio-box'>
                  <input
                    className='radio no-mobile-highlight'
                    type='radio'
                    id='c'
                    name='temp'
                    value='c'
                    checked={state.tempUnitSelection === 'c'}
                    onChange={toggleTempUnits}
                  />
                  <label htmlFor='c'>°C</label>
                </div>
              </div>
              <div className='unit-select'>
                <div className='radio-box'>
                  <input
                    className='radio no-mobile-highlight'
                    type='radio'
                    id='mi'
                    name='dist'
                    value='mi'
                    checked={state.distanceUnitSelection === 'mi'}
                    onChange={toggleDistanceUnits}
                  />
                  <label htmlFor='mi'>Miles</label>
                </div>
                <div className='radio-box'>
                  <input
                    className='radio no-mobile-highlight'
                    type='radio'
                    id='km'
                    name='dist'
                    value='km'
                    checked={state.distanceUnitSelection === 'km'}
                    onChange={toggleDistanceUnits}
                  />
                  <label htmlFor='km'>Kilometers</label>
                </div>
              </div>
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
              <h3 className='setting-description'>Weather formatting</h3>
              <h4 className='sub-heading'>Available variables:</h4>
              <div className='variable-list'>
                <div className='variable'>summary</div>
                <div className='variable'>temp</div>
                <div className='variable'>feelsLike</div>
                <div className='variable'>emoji</div>
                <div className='variable'>humidity</div>
                <div className='variable'>windSpeed</div>
                <div className='variable'>dewPoint</div>
                <div className='variable'>cloudCover</div>
                <div className='variable'>uvIndex</div>
                <div className='variable'>pressure</div>
                <div className='variable'>visibility</div>
                <div className='variable'>ozone</div>
              </div>
              <CustomFormat
                defaultValue='$temp$, $summary$ $emoji$'
                isSelected={isWeatherSelected}
                formatString={state.weatherFormatString}
                updateFormatString={updateWeatherFormatString}
              />
              <div className='button-box'>
                <button
                  type='button'
                  className='save-format-button no-mobile-highlight'
                  onClick={submitWeatherFormatString}
                  disabled={weatherFormatString === initialWeatherFormatString}
                >
                  Save
                </button>
              </div>
              <h3 className='setting-description'>Music formatting</h3>
              <h4 className='sub-heading'>Available variables:</h4>
              <div className='variable-list'>
                <div className='variable'>name</div>
                <div className='variable'>artists</div>
                <div className='variable'>album</div>
                <div className='variable'>duration</div>
              </div>
              <CustomFormat
                defaultValue='$name$ - $artists$'
                isSelected={isMusicSelected}
                formatString={state.musicFormatString}
                updateFormatString={updateMusicFormatString}
              />
              <div className='button-box'>
                <button
                  type='button'
                  className='save-format-button no-mobile-highlight'
                  onClick={submitMusicFormatString}
                  disabled={musicFormatString === initialMusicFormatString}
                >
                  Save
                </button>
              </div>
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
