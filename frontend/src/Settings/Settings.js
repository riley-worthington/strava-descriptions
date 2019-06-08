import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import ReactTooltip from 'react-tooltip';
import Sidebar from 'react-sidebar';
import CheckboxItem from '../Setup/CheckboxItem';
import Hamburger from '../widgets/Hamburger';
import BallLoader from '../widgets/BallLoader';
import Dropdown from '../Dashboard/Dropdown';
import history from '../history';
import '../images/withWaitForImages';
import { API_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../config';
import withWaitForImages from '../images/withWaitForImages';
import { generateRandomString } from '../helpers';
import './Settings.css';

const getAthleteSettings = athleteID => {
  return fetch(`${API_URL}/settings/${athleteID}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err));
}

const updateAthleteSettings = (athleteID, wantsWeather, wantsMusic) => {
  return fetch(`${API_URL}/settings/${athleteID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wantsWeather,
      wantsMusic,
    })
  })
    .then(res => {
      return res;
    })
    .catch(err => console.log(err));
}

const Settings = ({ athlete, imageSources }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isWeatherSelected, setIsWeatherSelected] = useState(null);
  const [isSpotifySelected, setIsSpotifySelected] = useState(null);
  const [isSpotifyAuthorized, setIsSpotifyAuthorized] = useState(false);
  const [initialWeatherSelected, setInitialWeatherSelected] = useState(null);
  const [initialSpotifySelected, setInitialSpotifySelected] = useState(null);

  useEffect(() => {
    getAthleteSettings(athlete.id)
      .then(settings => {
        const {
          wantsWeather,
          wantsMusic,
          hasAuthorizedSpotify,
        } = settings;
        setIsWeatherSelected(wantsWeather);
        setInitialWeatherSelected(wantsWeather);
        setIsSpotifySelected(wantsMusic);
        setInitialSpotifySelected(wantsMusic);
        setIsSpotifyAuthorized(hasAuthorizedSpotify);
        setIsLoading(false);
      })
  }, [athlete.id]);

  const toggleSelect = event => {
    if (event.target.id === 'weather') {
      setIsWeatherSelected(state => !state);
    } else if (event.target.id === 'spotify') {
      setIsSpotifySelected(state => !state);
    }
  }

  const onSubmit = event => {
    event.preventDefault();
    setIsUpdatingSettings(true);
    updateAthleteSettings(athlete.id, isWeatherSelected, isSpotifySelected)
      .then(() => {
        if (isSpotifySelected && !isSpotifyAuthorized) {
          const stateParam = generateRandomString(16);
          sessionStorage.setItem('stateParam', stateParam);
          Cookies.remove('stateParam');
          Cookies.set('stateParam', stateParam);
          const scope = 'user-read-recently-played';

          window.location.assign(`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`);
        } else {
          history.push('/dashboard');
        }
      })
      .catch(err => console.log(err));
  }

  const infoMessage = 'Whenever you upload an activity to Strava, Tiempo will collect weather data and recently played Spotify history. It will then automatically update the description with no action required on your end.';

  const mobileHeader = (
    <header className='top-bar-mobile'>
      <div className='sidebar-top-nav'>
        <Hamburger
          animation={'hamburger--spin'}
          onClick={() => setIsSidebarOpen(true)}
        />
        <h1 className='title'>TIEMPO</h1>
        <div className='filler'></div>
      </div>
    </header>
  );

  const desktopHeader = (
    <header className='top-bar-desktop'>
      <h1 className='title'>TIEMPO</h1>
      <Dropdown
        name={athlete.firstname}
        links={['/dashboard', '/logout']}
        titles={['Dashboard', 'Log out']}
      />
    </header>
  );

  const sidebarContent = (
    <div className='sidebar-content'>
      <div className='sidebar-top'>
        <Hamburger
          animation={'hamburger--spin'}
          isActive={isSidebarOpen}
          onClick={() => setIsSidebarOpen(false)}
        />
        <h3 className='username no-mobile-highlight'>{athlete.firstname}</h3>
      </div>
      <nav className='sidebar-nav'>
        <ul>
            <li><a href="/dashboard" className='no-mobile-highlight'>Dashboard</a></li>
            <li><a href="/logout" className='no-mobile-highlight'>Log out</a></li>
        </ul>
      </nav>
    </div>
  );

  // const message = (() => {
  //   const key = `${initialWeatherSelected}-${initialSpotifySelected}`;
  //   const messages = {
  //     'true-true': <p>Tiempo is syncing <b>weather</b> and <b>music</b>.</p>,
  //     'true-false': <p>Tiempo is syncing <b>weather</b>.</p>,
  //     'false-true': <p>Tiempo is syncing <b>music</b>.</p>,
  //     'false-false': <p>Tiempo is not updating your descriptions.</p>,
  //   }
  //   return messages[key];
  // })();

  const shouldDisableButton = (initialWeatherSelected === isWeatherSelected) && (initialSpotifySelected === isSpotifySelected);
  const bodyContent = isLoading
    ? <div className='loading-box'>
        <BallLoader id='black'/>
      </div>
    : <div className='settings-body'>
        <h2>Settings</h2>
        <div className='prompt-box fade-in'>
          <p className='prompt'>What information should Tiempo put in your activity descriptions?</p>
          <span className='more-info' data-tip={infoMessage}>How does this work?</span>
          <ReactTooltip className='tooltip' place='top' effect='solid' event='click' globalEventOff='click'/>
        </div>
        <div className='box fade-in'>
          <form className='tiempo-options'>
            <CheckboxItem id='weather' text='Weather conditions' defaultChecked={isWeatherSelected} onChange={toggleSelect} />
            <CheckboxItem id='spotify' text='Music you listened to' defaultChecked={isSpotifySelected} onChange={toggleSelect} />
          </form>
        </div>
        <button className='submit-button' onClick={onSubmit} disabled={shouldDisableButton}>Save</button>
        <div className='branding fade-in'>
          <a href='https://darksky.net/poweredby/' target="_blank" rel='noreferrer noopener'>
            <img id='darksky' src={imageSources['powered-by-dark-sky-black']} alt='Powered by DarkSky' />
          </a>
          <a href='https://www.spotify.com' id='spotify-link' target='_blank' rel='noreferrer noopener'>
            <div className='spotify-block'>
              <span className='provider'>Powered by</span>
              <img id='spotify' src={imageSources['spotify-logo-green']} alt='Powered by Spotify' />
            </div>
          </a>
        </div>
      </div>;

  return isUpdatingSettings
    ? <div className='loading-box'>
        <BallLoader id='black' />
        <h1 className="authorizing">Updating your settings</h1>
      </div>
    : <div className='settings-page'>
        <div className='desktop-stuff'>
        </div>
        <Sidebar
          sidebar={sidebarContent}
          open={isSidebarOpen}
          onSetOpen={setIsSidebarOpen}
          styles={{ sidebar: { background: "white" } }}
          defaultSidebarWidth={0}
          pullRight={false}
          sidebarId='mySidebar'
        >
          {mobileHeader}
          {desktopHeader}
          {bodyContent}
        </Sidebar>
      </div>

}

Settings.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  })
}

export default withWaitForImages(Settings, ['powered-by-dark-sky-black', 'spotify-logo-green']);
