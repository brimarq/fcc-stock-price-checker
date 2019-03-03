/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config(); // comment-out on Glitch
const expect = require('chai').expect;
const mongo = require('mongodb').MongoClient;

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  mongo.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
    let db = client.db();
    err ? console.log('Database error: ' + err) : console.log('Successful database connection');
    

    app.route('/api/stock-prices')
      .get(function (req, res){
        
      });

  });
    
};
