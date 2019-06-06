import React from 'react';
import ImageLoader from './ImageLoader';
import './UserSelectedSettings.css';

const UserSelectedSettings = ({ wantsWeather, wantsMusic }) => {
  if (wantsWeather && wantsMusic) {
    return (
      <div className='dashboard-body'>
        <div className='icons'>
          <span>
            <div className='icon-container'>
              <ImageLoader src={require('./sun.png')} alt='Sun' id='sun-face' />
            </div>
          </span>
          <div className='spacer'></div>
          <span id='plus-sign'>+</span>
          <div className='spacer'></div>
          <span>
            <div className='icon-container'>
              <ImageLoader src={require('./Spotify_Icon_RGB_Green.png')} alt='Spotify Logo' id='spotify-logo' />
            </div>
          </span>
        </div>
        <div className='message'>
          <p>You're good to go!</p>
          <p>Tiempo will sync <b>weather</b> and <b>music</b>.</p>
          <a className='settings-link' href='/settings'>Settings</a>
        </div>
      </div>
    );
  } else if (wantsWeather) {
    return (
      <div className='dashboard-body'>
        <div className='icons'>
          <span>
            <img id='sun-face' src={require('./sun.png')} alt='Sun' />
          </span>
        </div>
        <div className='message'>
          <p>You're good to go!</p>
          <p>Tiempo will sync <b>weather</b>.</p>
          <a className='settings-link' href='/settings'>Settings</a>
        </div>
      </div>
    );
  } else if (wantsMusic) {
    return (
      <div className='dashboard-body'>
        <div className='icons'>
          <span>
            <img id='spotify-logo' src={require('./Spotify_Icon_RGB_Green.png')} alt='Spotify Logo' />
          </span>
        </div>
        <div className='message'>
          <p>You're good to go!</p>
          <p>Tiempo will sync <b>music</b>.</p>
          <a className='settings-link' href='/settings'>Settings</a>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-body'>
      <div className='message no-images'>
        <p>Tiempo will not add to your descriptions.</p>
        <a className='settings-link' href='/settings'>Settings</a>
      </div>
    </div>
  );
}

export default UserSelectedSettings;
