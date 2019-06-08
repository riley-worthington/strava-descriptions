import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './UserSelectedSettings.css';

const UserSelectedSettings = ({ wantsWeather, wantsMusic, imageSources }) => {
  const icons = (
    <div className='icons'>
      {
        (wantsWeather) &&
        <span>
          <div className='icon-container'>
            <img src={imageSources['sun']} alt='Sun' id='sun-face'/>
          </div>
        </span>
      } {
        (wantsWeather && wantsMusic) &&
        <Fragment>
          <div className='spacer'></div>
          <span id='plus-sign'>+</span>
          <div className='spacer'></div>
        </Fragment>
      } {
        (wantsMusic) &&
        <span>
          <div className='icon-container'>
            <img src={imageSources['spotify-icon-green']} alt='Spotify Logo' id='spotify-logo' />
          </div>
        </span>
      }
    </div>
  );

  const message = (() => {
    const key = `${wantsWeather}-${wantsMusic}`;
    const messages = {
      'true-true': <p>Tiempo will sync <b>weather</b> and <b>music</b>.</p>,
      'true-false': <p>Tiempo will sync <b>weather</b>.</p>,
      'false-true': <p>Tiempo will sync <b>music</b>.</p>,
      'false-false': <p>Tiempo will not add to your descriptions.</p>,
    }
    return messages[key];
  })();


  return (
    <div className='dashboard-body fade-in'>
      { icons }
      <div className='message'>
        {(wantsWeather || wantsMusic) && <p>You're good to go!</p>}
        { message }
        <a className='settings-link' href='/settings'>Settings</a>
      </div>
    </div>
  );
}

UserSelectedSettings.propTypes = {
  wantsWeather: PropTypes.bool.isRequired,
  wantsMusic: PropTypes.bool.isRequired,
}

export default UserSelectedSettings;
