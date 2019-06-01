import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import CheckboxItem from './CheckboxItem';
import history from '../history';
import './Setup.css';
import { API_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';
import DarkSkyImg from './darksky.png';
import SpotifyImg from './Spotify.png';

class Setup extends Component {
  constructor() {
    super();

    this.state = {
      isWeatherSelected: true,
      isSpotifySelected: true,
      athlete: null,
      isLoading: true,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    this.setState({
      athlete,
      isLoading: false,
    })
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
    const { athlete, isWeatherSelected, isSpotifySelected } = this.state;
    const stravaAthleteID = athlete.id;
    fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        athleteID: stravaAthleteID,
        wantsWeather: isWeatherSelected,
        wantsMusic: isSpotifySelected,
      })
    })
    const stateParam = this.generateStateParam();
    sessionStorage.setItem('stateParam', stateParam);

    const scope = 'user-read-recently-played';

    if (isSpotifySelected) {
      window.location.assign(`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`);
    } else {
      history.push('/dashboard');
    }
  }

  generateStateParam() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  render() {
    const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';
    const { isLoading, athlete } = this.state;

    return ( isLoading ?
      <p>Loading</p> :
      (<div className='setup-page'>
        <header>
          <h1 className='title'>TIEMPO</h1>
        </header>
        <div className='welcome-box'>
          <p className='welcome-message'>{`Welcome, ${athlete.firstname}!`}</p>
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
        <button className='submit-button' onClick={this.onSubmit}>Let's Go!</button>
        <div className='branding'>
          <a href='https://darksky.net/poweredby/' target="_blank" rel='noreferrer noopener'>
            <img id='darksky' src={DarkSkyImg} alt='Powered by DarkSky'/>
          </a>
          <a href='https://www.spotify.com' id='spotify-link' target='_blank' rel='noreferrer noopener'>
            <div className='spotify-block'>
              <span className='provider'>Powered by</span>
              <img id='spotify' src={SpotifyImg} alt='Powered by Spotify'/>
            </div>
          </a>
        </div>
      </div>)
    );
  }
}

export default Setup;
