import React, { Fragment, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateAthleteSettings } from './athleteSettings';
import './UnitSettings.css';

const unitSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEMP_UNITS':
      return {
        ...state,
        tempUnitSelection: action.payload,
      };
    case 'IS_UPDATING_TEMP_UNITS':
      return {
        ...state,
        isUpdatingTempUnits: action.payload,
      };
    case 'SET_DISTANCE_UNITS':
      return {
        ...state,
        distanceUnitSelection: action.payload,
      };
    case 'IS_UPDATING_DISTANCE_UNITS':
      return {
        ...state,
        isUpdatingDistanceUnits: action.payload,
      };
    default:
      return state;
  }
};

const UnitSettings = ({ athleteID, initialTempUnits, initialDistanceUnits }) => {
  const [state, dispatch] = useReducer(unitSettingsReducer, {
    tempUnitSelection: initialTempUnits,
    distanceUnitSelection: initialDistanceUnits,
    isUpdatingTempUnits: false,
    isUpdatingDistanceUnits: false,
  });

  useEffect(() => {
    dispatch({ type: 'SET_TEMP_UNITS', payload: initialTempUnits });
    dispatch({ type: 'SET_DISTANCE_UNITS', payload: initialDistanceUnits });
  }, [athleteID, initialTempUnits, initialDistanceUnits]);

  const toggleTempUnits = event => {
    if (state.isUpdatingTempUnits) {
      return;
    }
    dispatch({ type: 'IS_UPDATING_TEMP_UNITS', payload: true });

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
      .finally(() => dispatch({ type: 'IS_UPDATING_TEMP_UNITS', payload: false }));
  };

  const toggleDistanceUnits = event => {
    if (state.isUpdatingDistanceUnits) {
      return;
    }
    dispatch({ type: 'IS_UPDATING_DISTANCE_UNITS', payload: true });

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
      .finally(() => dispatch({ type: 'IS_UPDATING_DISTANCE_UNITS', payload: false }));
  };

  return (
    <Fragment>
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
    </Fragment>
  );
};

UnitSettings.defaultProps = {
  initialTempUnits: 'f',
  initialDistanceUnits: 'mi',
};

UnitSettings.propTypes = {
  athleteID: PropTypes.number.isRequired,
  initialTempUnits: PropTypes.string,
  initialDistanceUnits: PropTypes.string,
};

export default UnitSettings;
