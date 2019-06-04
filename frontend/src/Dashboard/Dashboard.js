import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import BallLoader from '../BallLoader/BallLoader';
import UserSelectedSettings from './UserSelectedSettings';
import './Dashboard.css';
import { API_URL } from '../config';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stateParam: null,
      shouldUnderline: false,
      sidebarOpen: false,
      wantsWeather: null,
      wantsMusic: null,
      isLoading: true,
    };

    this.setUnderline = this.setUnderline.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    const stateParam = this.generateStateParam();
    sessionStorage.setItem('stateParam', stateParam);

    this.setState({ athlete, stateParam });

    // Fetch settings from backend
    const athleteID = athlete.id;
    console.log(athleteID);
    fetch(`${API_URL}/settings/${athleteID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        const { wantsWeather, wantsMusic } = res;
        console.log(wantsWeather, wantsMusic);
        this.setState({
          wantsWeather,
          wantsMusic,
          isLoading: false,
        });
      })
      .catch(error => console.log(error));
  }

  generateStateParam() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  setUnderline() {
    console.log(this.state.shouldUnderline);
    this.setState(state => ({
      shouldUnderline: !state.shouldUnderline
    }))
  }

  render() {
    const { athlete, shouldUnderline, isLoading, wantsWeather, wantsMusic } = this.state;

    const name = athlete ? athlete.firstname : '';

    const sidebarContent = (
      <div className='sidebar-content'>
        <div className='sidebar-top'>
          <button className={`hamburger hamburger--spin${this.state.sidebarOpen ? ' is-active' : ''}`} type="button" onClick={() => this.onSetSidebarOpen(false)}>
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
          <h3 className='username'>{name}</h3>
        </div>
        <nav className='sidebar-nav'>
          <ul>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/logout">Log out</a></li>
          </ul>
        </nav>
      </div>
    );

    const mobileHeader = (
      <header className='top-bar-mobile'>
        <div className='sidebar-top-nav'>
          <div className='filler'></div>
          <h1 className='title'>TIEMPO</h1>
          <button className="hamburger hamburger--spin" type="button" onClick={() => this.onSetSidebarOpen(true)}>
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </header>
    );

    const desktopHeader = (
      <header className='top-bar-desktop'>
        <h1 className='title'>TIEMPO</h1>
        <nav className="nav">
          <ul>
              <li onMouseEnter={this.setUnderline} onMouseLeave={this.setUnderline}>
                  <h3 className={`username underline${shouldUnderline ? ' hover': ''}`}>{name}</h3>
                  <ul>
                      <li><a href="/settings">Settings</a></li>
                      <li><a href="/logout">Log out</a></li>
                  </ul>
              </li>
          </ul>
        </nav>
      </header>
    );

    const bodyContent = isLoading
      ? <div className='loading-box'>
          <BallLoader id='black'/>
        </div>
      : <UserSelectedSettings wantsWeather={wantsWeather} wantsMusic={wantsMusic}/>
      ;

    return (
      <div className='dashboard'>
          <div className='desktop-stuff'>
            {desktopHeader}
            {bodyContent}
          </div>
          <Sidebar
            sidebar={sidebarContent}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            styles={{ sidebar: { background: "white" } }}
            defaultSidebarWidth={0}
            pullRight={false}
            sidebarId='mySidebar'
          >
            {mobileHeader}
            {bodyContent}
          </Sidebar>
      </div>
    );
  }
}

export default Dashboard;
