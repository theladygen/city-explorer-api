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
  const cityJson = weatherJson.find(
    (cityJson) =>
      request.query.lat === cityJson.lat && request.query.lon === cityJson.lon
  );

  if (!cityJson) {
    response.status(404).send({ error: 'City Not Found' });
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

const errorHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  response.status(500);
  response.render({ error });
};

app.use(errorHandler);
app.listen(PORT, () => {
  console.log('App is listening!');
});
