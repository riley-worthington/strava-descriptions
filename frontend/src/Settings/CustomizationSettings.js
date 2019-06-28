import React, { Fragment, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomFormat from './CustomFormat';
import { updateAthleteSettings } from './athleteSettings';
import './CustomizationSettings.css';

const customizationSettingsReducer = (state, action) => {
  switch (action.type) {
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
    case 'UPDATE_INITIAL_MUSIC_STRING':
      return {
        ...state,
        initialMusicFormatString: action.payload,
      };
    case 'IS_SUBMITTING_WEATHER_FORMAT_STRING':
      return {
        ...state,
        isSubmittingWeatherFormatString: action.payload,
      };
    case 'IS_SUBMITTING_MUSIC_FORMAT_STRING':
      return {
        ...state,
        isSubmittingMusicFormatString: action.payload,
      };
    default:
      return state;
  }
};

const CustomizationSettings = ({
  athleteID,
  isWeatherSelected,
  isMusicSelected,
  initialWeatherFormatString,
  initialMusicFormatString,
}) => {
  const [state, dispatch] = useReducer(customizationSettingsReducer, {
    isWeatherSelected,
    isMusicSelected,
    initialWeatherFormatString,
    weatherFormatString: initialWeatherFormatString,
    initialMusicFormatString,
    musicFormatString: initialMusicFormatString,
    isSubmittingWeatherFormatString: false,
    isSubmittingMusicFormatString: false,
  });

  useEffect(() => {
    dispatch({ type: 'UPDATE_WEATHER_FORMAT_STRING', payload: initialWeatherFormatString });
    dispatch({ type: 'UPDATE_MUSIC_FORMAT_STRING', payload: initialMusicFormatString });
  }, [athleteID, initialWeatherFormatString, initialMusicFormatString]);

  const updateWeatherFormatString = event => {
    dispatch({ type: 'UPDATE_WEATHER_FORMAT_STRING', payload: event.target.value });
  };

  const submitWeatherFormatString = () => {
    if (state.isSubmittingWeatherFormatString) {
      return;
    }
    dispatch({ type: 'IS_SUBMITTING_WEATHER_FORMAT_STRING', payload: true });

    const newWeatherFormatString = state.weatherFormatString;
    updateAthleteSettings(athleteID, {
      weatherFormatString: newWeatherFormatString,
    })
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: 'UPDATE_INITIAL_WEATHER_FORMAT_STRING', payload: newWeatherFormatString });
        } else {
          throw Error('Request failed');
        }
      })
      .catch(err => console.log(`Failed ${err}`))
      .finally(() => dispatch({ type: 'IS_SUBMITTING_WEATHER_FORMAT_STRING', payload: false }));
  };

  const updateMusicFormatString = event => {
    dispatch({ type: 'UPDATE_MUSIC_FORMAT_STRING', payload: event.target.value });
  };

  const submitMusicFormatString = () => {
    if (state.isSubmittingMusicFormatString) {
      return;
    }
    dispatch({ type: 'IS_SUBMITTING_MUSIC_FORMAT_STRING', payload: true });

    const { newMusicFormatString } = state.musicFormatString;
    updateAthleteSettings(athleteID, {
      musicFormatString: newMusicFormatString,
    })
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: 'UPDATE_INITIAL_MUSIC_FORMAT_STRING', payload: newMusicFormatString });
        } else {
          throw Error('Request failed');
        }
      })
      .catch(err => console.log(`Failed ${err}`))
      .finally(() => dispatch({ type: 'IS_SUBMITTING_MUSIC_FORMAT_STRING', payload: false }));
  };

  return (
    <Fragment>
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
        isSelected={isWeatherSelected}
        formatString={state.weatherFormatString}
        updateFormatString={updateWeatherFormatString}
      />
      <div className='button-box'>
        <button
          type='button'
          className='save-format-button no-mobile-highlight'
          onClick={submitWeatherFormatString}
          disabled={state.weatherFormatString === state.initialWeatherFormatString}
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
        isSelected={isMusicSelected}
        formatString={state.musicFormatString}
        updateFormatString={updateMusicFormatString}
      />
      <div className='button-box'>
        <button
          type='button'
          className='save-format-button no-mobile-highlight'
          onClick={submitMusicFormatString}
          disabled={state.musicFormatString === state.initialMusicFormatString}
        >
          Save
        </button>
      </div>
    </Fragment>
  );
};

CustomizationSettings.defaultProps = {
  isWeatherSelected: true,
  isMusicSelected: true,
  initialWeatherFormatString: '',
  initialMusicFormatString: '',
};

CustomizationSettings.propTypes = {
  athleteID: PropTypes.number.isRequired,
  isWeatherSelected: PropTypes.bool,
  isMusicSelected: PropTypes.bool,
  initialWeatherFormatString: PropTypes.string,
  initialMusicFormatString: PropTypes.string,
};

export default CustomizationSettings;
