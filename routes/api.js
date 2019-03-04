/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config(); // comment-out on Glitch
const axios = require('axios');
const expect = require('chai').expect;
const IEX_API_BASE_URL = "https://api.iextrading.com/1.0/stock/"
// const mongo = require('mongodb').MongoClient;

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


module.exports = function (app, db) {

  app.route('/api/stock-prices').get(function (req, res) {
    const q = req.query;
    q.ip = req.ip;
    console.log(q);

    function processData(data) {
      res.send(data);
    }

    let datareq = typeof q.stock === 'string' 
      ? [axios.get(IEX_API_BASE_URL + q.stock + '/quote'), null] 
      : [axios.get(IEX_API_BASE_URL + q.stock[0] + '/quote'), 
        axios.get(IEX_API_BASE_URL + q.stock[1] + '/quote')]
    ;

    axios.all(datareq)
      .then(axios.spread(function (res1, res2) {
        let data = [], resArr = [res1, res2];
        
        for (let i = 0; i < resArr.length; ++i) {
          if (resArr[i]) {
            data.push({
              stock: resArr[i].data.symbol, 
              price: resArr[i].data.latestPrice.toString()
            });
          }
        }

        return data;

      }))
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(data => processData(data))
    ;
    
  });
  
    
};

