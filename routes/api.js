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
// const mongo = require('mongodb').MongoClient;

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/stock-prices').get(function (req, res) {
    let query = req.query;
    console.log(query);
    //res.send(JSON.parse(res));
  });
  
    
};

