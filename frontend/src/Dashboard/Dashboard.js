import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { SPOTIFY_REDIRECT_URI, SPOTIFY_CLIENT_ID } from '../config';
import './Dashboard.css';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stateParam: null,
      shouldUnderline: false,
      sidebarOpen: false,
    };

    this.setUnderline = this.setUnderline.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    const stateParam = this.generateStateParam();
    sessionStorage.setItem('stateParam', stateParam);
    console.log(athlete, stateParam);

    this.setState({ athlete, stateParam });
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
    const { athlete, stateParam, shouldUnderline } = this.state;
    const scope = 'user-read-recently-played';

    const name = athlete ? athlete.firstname : '';

    return (
      <div className='dashboard'>
        <header className='top-bar'>
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
          <Sidebar
            sidebar={
              <div className='sidebar-content'>
                <div className='sidebar-top'>
                  <button class={`hamburger hamburger--spin-r${this.state.sidebarOpen ? ' is-active' : ''}`} type="button" onClick={() => this.onSetSidebarOpen(false)}>
                    <span class="hamburger-box">
                      <span class="hamburger-inner"></span>
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
            }
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            styles={{ sidebar: { background: "white" } }}
            defaultSidebarWidth={0}
            pullRight={true}
            sidebarId='mySidebar'
          >
            <div className='sidebar-top-nav'>
              <h1 className='title'>TIEMPO</h1>
              <button class="hamburger hamburger--spin-r" type="button" onClick={() => this.onSetSidebarOpen(true)}>
                <span class="hamburger-box">
                  <span class="hamburger-inner"></span>
                </span>
              </button>
            </div>
          </Sidebar>
        </header>
      </div>
    );
  }
}

export default Dashboard;
