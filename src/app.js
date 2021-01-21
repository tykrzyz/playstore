require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');

const app = express();


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

const playstore = require('./playstore');

app.get('/apps', (req, res) => {
  const { sort, genre = ''} = req.query;
  if(sort){
    if(!['Rating', 'App'].includes(sort)){
      return res
        .status(400)
        .send('Sort must be of Rating or App');
    } 
  }

  if(genre){
    if(!['Action', 'Puzzle', 'Strategy', 'Arcade', 'Casual', 'Card'].includes(genre))
      return res.status(400).send('Genre should be one of [\'Action\', \'Puzzle\', \'Strategy\', \'Casual\', \'Arcade\', \'Card\']');
  }

  let results = playstore.filter(app => {
    return app.Genres.toLowerCase().includes(genre.toLowerCase());
  });

  if(sort){
    results.sort((a,b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  

  res.json(results);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;