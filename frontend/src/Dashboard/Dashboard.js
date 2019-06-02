import React, { Component } from 'react';
import { SPOTIFY_REDIRECT_URI, SPOTIFY_CLIENT_ID } from '../config';
import './Dashboard.css';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stateParam: null,
      shouldUnderline: false,
    };

    this.setUnderline = this.setUnderline.bind(this);
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
          {/* <h3 className='username underline'>{name}</h3> */}
          <nav class="nav">
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
      </div>
    );
  }
}

export default Dashboard;
