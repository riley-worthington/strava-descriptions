import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from '../Page/Page';
import BallLoader from '../widgets/BallLoader';
import UserSelectedSettings from './UserSelectedSettings';
import withWaitForImages from '../images/withWaitForImages';
import './Dashboard.css';
import { getAthleteSettings } from '../Settings/athleteSettings';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      wantsWeather: null,
      wantsMusic: null,
      isLoading: true,
    };

  }

  componentDidMount() {
    // Fetch settings from backend
    const { athlete } = this.props;
    const athleteID = athlete.id;
    getAthleteSettings(athleteID)
      .then(res => {
        const { wantsWeather, wantsMusic } = res;
        this.setState({
          wantsWeather,
          wantsMusic,
          isLoading: false,
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { athlete, imageSources } = this.props;
    const { isLoading, wantsWeather, wantsMusic } = this.state;

    const outLinks = [
      {
        href: '/settings',
        title: 'Settings',
      },
      {
        href: '/logout',
        title: 'Log out',
      },
    ];

    return (
      <Page athlete={athlete} outLinks={outLinks}>
        {isLoading
          ? <div className='loading-box'>
              <BallLoader id='black'/>
            </div>
          : <UserSelectedSettings
              wantsWeather={wantsWeather}
              wantsMusic={wantsMusic}
              imageSources={imageSources}
            />
        }
      </Page>
    );
  }
}

Dashboard.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  })
}

export default withWaitForImages(Dashboard, ['sun', 'spotify-icon-green']);
