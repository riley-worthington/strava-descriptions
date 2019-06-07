import React from 'react';
import { Redirect } from 'react-router-dom';

const getAthleteObject = () => {
  const athlete = localStorage.getItem('athlete');
  try {
    return JSON.parse(athlete);
  } catch {
    return null;
  }
}

/*  Renders given component with athlete object as prop,
    else redirects if user is not logged in  */
const withAthlete = (Component) => (props) => {
  const athlete = getAthleteObject();
  const loggedIn = !!(athlete && athlete.id);
  return loggedIn
    ? <Component {...props} athlete={athlete} />
    : <Redirect to={{
        pathname: "/",
        state: { from: props.location }
      }} />
}

export default withAthlete;
