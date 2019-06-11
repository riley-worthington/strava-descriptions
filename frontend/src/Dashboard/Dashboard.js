import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Page from '../Page/Page';
import BallLoader from '../widgets/BallLoader';
import UserSelectedSettings from './UserSelectedSettings';
import withWaitForImages from '../images/withWaitForImages';
import { getAthleteSettings } from '../Settings/athleteSettings';
import './Dashboard.css';

const initialState = {
  wantsWeather: null,
  wantsMusic: null,
  isLoading: true,
  isError: false,
}

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_SETTINGS':
      const { wantsWeather, wantsMusic } = action.payload;
      return {
        ...state,
        wantsWeather,
        wantsMusic,
        isLoading: false,
      };
    case 'GET_SETTINGS_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      return state;
  }
}

const Dashboard = ({ athlete, imageSources }) => {
  const athleteID = athlete.id;
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    let didCancel = false;

    getAthleteSettings(athleteID)
      .then(res => !didCancel && dispatch({ type: 'INITIALIZE_SETTINGS', payload: res }))
      .catch(err => !didCancel && dispatch({ type: 'GET_SETTINGS_FAILURE' }));

    return () => {
      didCancel = true;
    };
  }, [athleteID]);

  const { wantsWeather, wantsMusic, isLoading, isError } = state;
  const outLinks = [
    {
      href: '/settings',
      title: 'Settings',
    },
    {
      href: '/logout',
      title: 'Log out',
    },
  ];

  let body;
  if (isLoading) {
    body = (
      <div className='loading-box'>
        <BallLoader id='black'/>
      </div>
    );
  } else if (isError) {
    body = (
      <div className='loading-box'>
        <h3>Couldn't load information.</h3>
      </div>
    );
  } else {
    body = (
      <UserSelectedSettings
        wantsWeather={wantsWeather}
        wantsMusic={wantsMusic}
        imageSources={imageSources}
      />
    );
  }

  return (
    <Page athlete={athlete} outLinks={outLinks}>
      { body }
    </Page>
  );
}

Dashboard.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  })
}

export default withWaitForImages(Dashboard, ['sun', 'spotify-icon-green']);
