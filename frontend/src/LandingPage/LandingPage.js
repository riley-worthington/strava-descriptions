import React, { Component } from 'react';
import history from '../history';

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      stateParam: null,
    };
  }

  componentDidMount() {
    const athlete = localStorage.getItem('athlete');
    console.log(athlete);
    if (athlete) {
      history.push('/dashboard');
    } else {
      const stateParam = this.generateStateParam();
      sessionStorage.setItem('stateParam', stateParam);
      this.setState({ stateParam });
    }
  }

  generateStateParam() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  render() {
    const redirectURI = 'http://localhost:3000/auth/strava';
    const scope = 'activity:read_all,activity:write';
    const clientID = 35477;
    const { stateParam } = this.state;


    return (
      <div className="App">
        <header className="App-header">
          Strava description updater
        </header>
        <main>
          <a href={`https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${stateParam}`}>
            <img src={require("../btn_strava_connectwith_orange.svg")} alt="Connect with Strava"/>
          </a>
        </main>
      </div>
    );
  }
}

export default LandingPage;
