const express = require('express');
const bodyParser = require('body-parser');
const emoji = require('node-emoji');

const authorizeStrava = require('./authorizeStrava');
const handleWebhookEvent = require('./handleWebhookEvent');

const { PORT } = require('./config');


const app = express();

app.use(bodyParser.json());

app.get('/login', authorizeStrava);

app.get('/subscription', (req, res) => {
  const challenge = req.query['hub.challenge'];
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'hub.challenge': challenge }));
})

app.post('/subscription', (req, res) => {
  res.sendStatus(200);
  const { object_type, aspect_type, object_id, owner_id } = req.body;

  if (object_type === 'activity' && aspect_type === 'create') {
    handleWebhookEvent(object_id, owner_id)
      .then(console.log(`Successfully updated description for activity ${object_id}`))
      .catch(error => console.log(error));
  }
})

app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

const port = PORT || 8000;

app.listen(port, () => {
  console.log(emoji.get('satellite_antenna') + '  Listening on port ' + port);
});
