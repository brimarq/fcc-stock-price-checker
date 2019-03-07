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
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

// mongo.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
//   let db = client.db();
//   err ? console.log('Database error: ' + err) : console.log('Successful database connection');
// });


module.exports = function (app) {

  app.route('/api/stock-prices').get(function (req, res) {
    const q = req.query;
    q.ip = req.ip;
    console.log(q);
    

    function handleData(data) {
      //console.log(data);
      const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true });

      client.connect(function (err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB server");

        const db = client.db(); 
        const coll = db.collection('likedstocks');

        async function processData(data) {

          const arr = data.map(async ele => {

            const response = await coll.findOne({stock: ele.stock})
              .then(doc => {

                if (!q.like) {
                  if (doc) {
                    return {stock: doc.stock, price: ele.price, likes: doc.likes};
                  } else {
                    return {stock: ele.stock, price: ele.price, likes: 0};
                  }
                } else { // 'liked' stock
                  if (!doc) {
                    let stock = ele.stock, likes = 1, ips = [req.ip];
                    let newDoc = {stock: ele.stock, likes: 1, ips: [req.ip]};
                    async function insertDoc(doc) {
                      const response =  await coll.insertOne(doc).catch(error => console.log(error));
                      return response;
                    }
                    insertDoc(newDoc)
                    .then(() => ({stock, price: ele.price, likes}));
                    
                  }
                }

              })
              .catch(error => console.log(error))
            ;

            return response;

          });

          const processedData = await Promise.all(arr);

          return processedData;

        }; // END processData



        processData(data)
          .then(result => console.log(result))
          .then(client.close(false, () => console.log('database closed')));
        
      }); // END client.connect

      res.send('done');

    } // END handleData

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
      .then(data => handleData(data))
    ;
    
  });
  
    
};

