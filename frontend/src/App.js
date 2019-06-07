import React, { Component, Fragment } from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';

import LandingPage from './LandingPage/LandingPage';
import StravaAuth from './Auth/StravaAuth';
import SpotifyAuth from './Auth/SpotifyAuth';
import Dashboard from './Dashboard/Dashboard';
import Setup from './Setup/Setup';
import Logout from './Auth/Logout';
import withAthlete from './Auth/withAthlete';
import './App.css';


class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Fragment>
          <Route exact path={'/'} component={LandingPage} />
          <Route path={'/dashboard'} component={withAthlete(Dashboard)} />
          <Route path={'/setup'} component={withAthlete(Setup)} />
          <Route path={'/settings'} component={withAthlete(Setup)} />
          <Route path={'/auth/strava'} component={StravaAuth} />
          <Route path={'/auth/spotify'} component={withAthlete(SpotifyAuth)} />
          <Route path={'/logout'} component={Logout} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
