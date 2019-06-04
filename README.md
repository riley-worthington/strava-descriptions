# TIEMPO

[https://tiempo.run](https://tiempo.run)

Tiempo connects to your [Strava](https://www.strava.com) account and allows you to automatically upload weather conditions and Spotify listening history to your activity descriptions. You sign in with Strava, select whether to include weather, music, or both, and Tiempo does the rest.

### How it works
Every time a new activity is created, Tiempo will look at the start time and coordinates to determine the weather. If Spotify is connected, it will look back through recent play history to find songs that played during the activity. It will then populate the description of the activity with this new information.

Uses [Dark Sky](https://darksky.net/dev) and [Spotify](https://developer.spotify.com/documentation/web-api/) APIs.

*Note: The backend is hosted for free on Heroku and sleeps after inactivity. Please be patient as it takes a couple seconds to wake up!*
