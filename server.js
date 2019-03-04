'use strict';
require('dotenv').config(); // comment-out on Glitch
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongo = require('mongodb').MongoClient;
const PORT = process.env.PORT || 3000; 
const NODE_ENV = process.env.NODE_ENV;

const app = express();

app.use(helmet());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongo.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
  let db = client.db();
  err ? console.log('Database error: ' + err) : console.log('Successful database connection');
  
    //Index page (static HTML)
  app.route('/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  //For FCC testing purposes
  fccTestingRoutes(app);

  //Routing for API 
  apiRoutes(app, db);  
      
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404).type('text').send('Not Found');
  });

  //Start our server and tests!
  app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
    if(NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          let error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  });
  

});



module.exports = app; //for testing
