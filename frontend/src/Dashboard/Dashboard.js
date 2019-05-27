import React, { Component } from 'react';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      athlete: null,
      stravaAccessToken: null,
    };
  }

  componentDidMount() {
    const athlete = JSON.parse(localStorage.getItem('athlete'));
    console.log(athlete);
    this.setState({ athlete });
  }

  render() {
    const { athlete } = this.state;

    return athlete ? (
      <div>
        {`Welcome ${athlete.firstname}`}
      </div>
    ) : (
      <div>
        Loading
      </div>
    );
  }
}

export default Dashboard;
