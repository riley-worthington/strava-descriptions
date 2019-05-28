import React, { Component } from 'react';

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
    const redirectURI = 'http://localhost:3000/auth/spotify';
    const scope = 'user-read-recently-played';
    const clientID = '1a53d994d3e34232963128be73095d68';

    return athlete ? (
      <div>
        {`Welcome ${athlete.firstname}`}
        <a href={`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURI}&scope=${scope}&state=${stateParam}`}>Authorize Spotify</a>
      </div>
    ) : (
      <div>
        Loading
      </div>
    );
  }
}

export default Dashboard;
