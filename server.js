require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authorizeStrava = require('./authorizeStrava');

const app = express();

app.use(bodyParser.json());

app.get('/login', authorizeStrava);

app.get('/', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
})

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('We are live on ' + port);
});
