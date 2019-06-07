import React, { Fragment } from 'react';
import ImageLoader from './ImageLoader';
import './UserSelectedSettings.css';

const UserSelectedSettings = ({ wantsWeather, wantsMusic }) => {

  const icons = (
    <div className='icons'>
      {
        (wantsWeather) &&
        <span>
          <div className='icon-container'>
            <ImageLoader src={require('./sun.png')} alt='Sun' id='sun-face' />
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
            <ImageLoader src={require('./Spotify_Icon_RGB_Green.png')} alt='Spotify Logo' id='spotify-logo' />
          </div>
        </span>
      }
    </div>
  );

  const message = (() => {
    if (wantsWeather && wantsMusic) {
      return <p>Tiempo will sync <b>weather</b> and <b>music</b>.</p>
    } else if (wantsWeather) {
      return <p>Tiempo will sync <b>weather</b>.</p>
    } else if (wantsMusic) {
      return <p>Tiempo will sync <b>music</b>.</p>
    } else {
      return <p>Tiempo will not add to your descriptions.</p>
    }
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

export default UserSelectedSettings;
