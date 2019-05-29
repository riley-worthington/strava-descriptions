import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import './Setup.css';

class Setup extends Component {

  render() {
    const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';

    return (
      <div className='setup-page'>
        <header>
          <h1>TIEMPO</h1>
        </header>
        <div className='welcome-box'>
          <p className='welcome-message'>Welcome, Riley!</p>
        </div>
        <div className='prompt-box'>
          <p className='prompt'>What information should Tiempo put in your activity descriptions?</p>
          <span className='more-info' data-tip={infoMessage}>How does this work?</span>
          <ReactTooltip className='tooltip' place='top' effect='solid'/>
        </div>
        <div className='box'>
          <form className='tiempo-options'>
            <label className='checkbox-label'>
              <input type="checkbox" id="weather" defaultChecked />
              <span className='checkbox-custom'></span>
              <div className='option-field'>
                <span className='label-text'>Weather conditions</span>
                <span className='provider'>Powered by DarkSky</span>
              </div>
            </label>
            <label className='checkbox-label'>
              <input type="checkbox" id="music" defaultChecked />
              <span className='checkbox-custom'></span>
              <div className='option-field'>
                <span className='label-text'>Music you listened to</span>
                <span className='provider'>Powered by Spotify</span>
              </div>

            </label>
          </form>
        </div>
        <button className='submit-button'>Let's Go!</button>
      </div>
    );
  }
}

export default Setup;
