import React from 'react';
import Page from '../Page/Page';
import './About.css';

const outLinks = [
  {
    href: '/dashboard',
    title: 'Dashboard',
  },
  {
    href: '/settings',
    title: 'Settings',
  },
  {
    href: '/logout',
    title: 'Log out',
  },
];

const About = ({ athlete }) => (
  <Page athlete={athlete} outLinks={outLinks}>
    <div className='about-page'>
      <h2 className='page-title'>About</h2>
      <div className='question-box'>
        <h3 className='question'>What does Tiempo do?</h3>
        <p className='answer'>
          Tiempo automatically updates the descriptions of your new Strava activities. You can
          choose in the
          {' '}
          <a href='/settings'>settings</a>
          {' '}
whether you want to include weather
          conditions or music you listened to on Spotify during the activity.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>What is required on my end to make it work?</h3>
        <p className='answer'>
          All you need to do is sign in with your Strava account and check the boxes of what you
          want Tiempo to display. If you choose to sync music, Tiempo will walk you through
          connecting your Spotify account. That's it! The goal is to have Tiempo be as simple and
          pain-free to use as possible.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>DATA. DATA. DATA. WHAT ARE YOU DOING WITH MY DATA??</h3>
        <p className='answer'>
          The only piece of your data that Tiempo stores is a token which allows it to communicate
          with Strava on your behalf. Everything else (location, time, music) is looked at when
          activity is uploaded to provide weather and music information, but is not stored in any
          way. You can also
          {' '}
          <a href='https://www.strava.com/settings/apps'>revoke access to Tiempo</a>
          {' '}
at any time
          through your Strava settings. If you have further concerns please email
          {' '}
          <a href='mailto:support@tiempo.run'>support@tiempo.run</a>
.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>
          How is Tiempo different from other third-party apps that do the same thing?
        </h3>
        <p className='answer'>
          There are apps that do weather, and apps that do music. Tiempo does both out of the box.
          Also, Tiempo doesn't add any watermarks (e.g. Powered by Tiempo) to your descriptions. You
          are in full control of your feed aesthetics.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>What are some features coming in the future?</h3>
        <p className='answer'>
          Soon, you will be able to manually format the way your descriptions get updated, as well
          as view data about your performance relative to weather, music genre, and potentially
          other factors. If you have a cool idea for a feature, email me at
          {' '}
          <a href='mailto:support@tiempo.run'>support@tiempo.run</a>
          {' '}
and I'll see about making it
          happen.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>It's not working for me. Who do I talk to?</h3>
        <p className='answer'>
          Email
          {' '}
          <a href='mailto:support@tiempo.run'>support@tiempo.run</a>
          {' '}
with a description of the
          problem you are having and I will look into it.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>Are you making money off of this?</h3>
        <p className='answer'>
          No. Tiempo is a personal project of mine to build my resume, and implements some features
          I thought would be nice to have on Strava. If you enjoy using Tiempo though and feel it
          brings you value, feel free to
          {' '}
          <a href='https://paypal.me/rileyjw'>buy me a beer</a>
.
        </p>
      </div>
      <div className='question-box'>
        <h3 className='question'>Who are you?</h3>
        <p className='answer'>
          My name is Riley Worthington. I'm a former D3 collegiate cross country runner and computer
          science major.
        </p>
      </div>
    </div>
  </Page>
);

export default About;
