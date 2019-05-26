import React, { Component } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

class App extends Component {
  constructor() {
    super();

    this.state = {
      stateParam: null,
      athlete: null,
      stravaAccessToken: null,
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const stateParam = urlParams.get('state');
      const sessionState = sessionStorage.getItem('stateParam');
      if (sessionState === stateParam) {
        // fetch to backend for token
        fetch(`${API_URL}/auth/strava`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code,
          })
        })
        .then(res => res.json())
        .then(res => {
          const { athlete, stravaAccessToken } = res;
          this.setState({
            athlete,
            stravaAccessToken,
          })
        })
        .catch(err => console.log(err));
      }
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
    const { athlete, stateParam } = this.state;
    const redirectURI = 'http://localhost:3000';
    const scope = 'activity:read_all,activity:write';
    const clientID = 35477;

    const connectStrava = athlete ? (
      `Success! Welcome ${athlete.firstname}`
    ) : (
      <a href={`https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${stateParam}`}>
        <img src={require("./btn_strava_connectwith_orange.svg")} alt="Connect with Strava"/>
      </a>
    );

    return (
      <div className="App">
        <header className="App-header">
          Strava description updater
        </header>
        <main>
          {connectStrava}
        </main>
      </div>
    );
  }
}

export default App;
