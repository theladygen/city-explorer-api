'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const weatherJson = require('./data/weather.json');

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', (request, response) => {
  if (!request.query.searchQuery) {
    response.status(400).send('Bad Request');
    return;
  }

  const cityJson = weatherJson.find(
    (cityJson) =>
      request.query.searchQuery.toUpperCase() ===
      cityJson.city_name.toUpperCase()
  );

  if (!cityJson) {
    response.status(404).send('City Not Found');
    return;
  }

  const forecasts = cityJson.data.map((forecastJson) => {
    return new Forecast(
      forecastJson.datetime,
      forecastJson.weather.description
    );
  });

  response.status(200).send(forecasts);
});

app.listen(PORT, () => {
  console.log('App is listening!');
});
