import React, { Component } from 'react';
import { SPOTIFY_REDIRECT_URI, SPOTIFY_CLIENT_ID } from '../config';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stateParam: null,
    };
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

  render() {
    const { athlete, stateParam } = this.state;
    const scope = 'user-read-recently-played';

    return athlete ? (
      <div>
        {`Welcome ${athlete.firstname}`}
        <a href={`https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&state=${stateParam}`}>Authorize Spotify</a>
      </div>
    ) : (
      <div>
        Loading
      </div>
    );
  }
}

export default Dashboard;
