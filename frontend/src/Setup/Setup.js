import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import CheckboxItem from './CheckboxItem';
import './Setup.css';

class Setup extends Component {
  constructor() {
    super();

    this.state = {
      isWeatherSelected: true,
      isSpotifySelected: true,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleSelect(event) {
    if (event.target.id === 'weather') {
      this.setState(state => ({
        isWeatherSelected: !state.isWeatherSelected
      }))
    } else if (event.target.id === 'spotify') {
      this.setState(state => ({
        isSpotifySelected: !state.isSpotifySelected
      }))
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const { isWeatherSelected, isSpotifySelected } = this.state;
    

  }

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
            <CheckboxItem id='weather' text='Weather conditions' onChange={this.handleSelect} />
            <CheckboxItem id='spotify' text='Music you listened to' onChange={this.handleSelect} />
          </form>
        </div>
        <p className='hesitant'>(You can change this at any time)</p>
        <button className='submit-button'>Let's Go!</button>
        <div className='branding'>
          <a href='https://darksky.net/poweredby/' target="_blank" rel='noreferrer noopener'>
            <img id='darksky' src={require('./darksky.png')} alt='Powered by DarkSky'/>
          </a>
          <a href='https://www.spotify.com' id='spotify-link' target='_blank' rel='noreferrer noopener'>
            <div className='spotify-block'>
              <span className='provider'>Powered by</span>
              <img id='spotify' src={require('./Spotify.png')} alt='Powered by Spotify'/>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default Setup;
