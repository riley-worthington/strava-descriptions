const { Client } = require('pg');
const { DATABASE_URL } = require('./config');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: true,
});

client.connect();

module.exports = client;
