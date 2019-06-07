import React, { Component, Fragment } from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';

import LandingPage from './LandingPage/LandingPage';
import PrivateRoute from './Auth/PrivateRoute';
import StravaAuth from './Auth/StravaAuth';
import SpotifyAuth from './Auth/SpotifyAuth';
import Dashboard from './Dashboard/Dashboard';
import Setup from './Setup/Setup';
import Logout from './Auth/Logout';
import './App.css';


class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Fragment>
          <Route exact path={'/'} component={LandingPage} />
          <PrivateRoute path={'/dashboard'} component={Dashboard} />
          <PrivateRoute path={'/setup'} component={Setup} />
          <PrivateRoute path={'/settings'} component={Setup} />
          <Route path={'/auth/strava'} component={StravaAuth} />
          <PrivateRoute path={'/auth/spotify'} component={SpotifyAuth} />
          <Route path={'/logout'} component={Logout} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
