import React, { Component, Fragment } from 'react';
import { Router, Route } from "react-router-dom";
import history from './history';

import LandingPage from './LandingPage/LandingPage';
import PrivateRoute from './Auth/PrivateRoute';
import StravaAuth from './Auth/StravaAuth';
import Dashboard from './Dashboard/Dashboard';
// import './App.css';


class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Fragment>
          <Route exact path={`/`} component={LandingPage} />
          <PrivateRoute path={`/dashboard`} component={Dashboard} />
          <Route path={`/auth/strava`} component={StravaAuth} />
        </Fragment>
      </Router>
    );
  }
}

export default App;
