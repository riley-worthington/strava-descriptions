const { Client } = require('pg');
const { DATABASE_URL } = require('./config');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: true,
});

try {
  client.connect();
} catch (error) {
  console.log(`Couldn't connect to database: ${error}`);
}

module.exports = client;
