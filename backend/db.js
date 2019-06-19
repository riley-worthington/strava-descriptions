const { Client } = require('pg');
const { DATABASE_URL } = require('./config');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: true,
});

client.connect();

client.on('error', err => console.log(`Couldn't connect to database: ${err}`));

module.exports = client;
