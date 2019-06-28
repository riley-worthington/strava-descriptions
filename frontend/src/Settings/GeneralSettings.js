import React, { Fragment, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckboxItem from '../Setup/CheckboxItem';
import { updateAthleteSettings } from './athleteSettings';
import { setNewStateParam } from '../Auth/authHelpers';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';
import './GeneralSettings.css';

const generalSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IS_WEATHER_SELECTED':
      return {
        ...state,
        isWeatherSelected: action.payload,
      };
    case 'IS_UPDATING_WEATHER_SETTING':
      return {
        ...state,
        isUpdatingWeatherSetting: action.payload,
      };
    case 'SET_IS_MUSIC_SELECTED':
      return {
        ...state,
        isMusicSelected: action.payload,
      };
    case 'IS_UPDATING_MUSIC_SETTING':
      return {
        ...state,
        isUpdatingMusicSetting: action.payload,
      };
    default:
      return state;
  }
};

const GeneralSettings = ({
  athleteID,
  isSpotifyAuthorized,
  initialWeatherSetting,
  initialMusicSetting,
}) => {
  const [state, dispatch] = useReducer(generalSettingsReducer, {
    isWeatherSelected: initialWeatherSetting,
    isMusicSelected: initialMusicSetting,
    isUpdatingWeatherSetting: false,
    isUpdatingMusicSetting: false,
  });

  useEffect(() => {
    dispatch({ type: 'SET_IS_WEATHER_SELECTED', payload: initialWeatherSetting });
    dispatch({ type: 'SET_IS_MUSIC_SELECTED', payload: initialMusicSetting });
  }, [athleteID, isSpotifyAuthorized, initialWeatherSetting, initialMusicSetting]);

  const toggleWantsWeather = () => {
    if (state.isUpdatingWeatherSetting) {
      return;
    }
    dispatch({ type: 'IS_UPDATING_WEATHER_SETTING', payload: true });

    const isChecked = state.isWeatherSelected;
    dispatch({ type: 'SET_IS_WEATHER_SELECTED', payload: !isChecked });
    updateAthleteSettings(athleteID, {
      wantsWeather: !isChecked,
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error('Request failed');
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'SET_IS_WEATHER_SELECTED', payload: isChecked });
      })
      .finally(() => dispatch({ type: 'IS_UPDATING_WEATHER_SETTING', payload: false }));
  };

  const toggleWantsMusic = async () => {
    if (state.isUpdatingMusicSetting) {
      return;
    }
    dispatch({ type: 'IS_UPDATING_MUSIC_SETTING', payload: true });

    const isChecked = state.isMusicSelected;
    dispatch({ type: 'SET_IS_MUSIC_SELECTED', payload: !isChecked });
    updateAthleteSettings(athleteID, {
      wantsMusic: !isChecked,
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error('Request failed');
        }
        if (state.isMusicSelected && !isSpotifyAuthorized) {
          const stateParam = setNewStateParam();
          const scope = 'user-read-recently-played';
          window.location.assign(
            `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=settings${stateParam}`,
          );
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'SET_IS_MUSIC_SELECTED', payload: isChecked });
      })
      .finally(() => dispatch({ type: 'IS_UPDATING_MUSIC_SETTING', payload: false }));
  };

  return (
    <Fragment>
      <h3 className='setting-description'>Add to descriptions:</h3>
      <div className='checkboxes'>
        <CheckboxItem
          id='weather'
          text='Weather conditions'
          checked={state.isWeatherSelected}
          onChange={toggleWantsWeather}
        />
        <CheckboxItem
          id='spotify'
          text='Music you listened to'
          checked={state.isMusicSelected}
          onChange={toggleWantsMusic}
        />
      </div>
    </Fragment>
  );
};

GeneralSettings.defaultProps = {
  isSpotifyAuthorized: false,
  initialWeatherSetting: true,
  initialMusicSetting: true,
};

GeneralSettings.propTypes = {
  athleteID: PropTypes.number.isRequired,
  isSpotifyAuthorized: PropTypes.bool,
  initialWeatherSetting: PropTypes.bool,
  initialMusicSetting: PropTypes.bool,
};

export default GeneralSettings;
