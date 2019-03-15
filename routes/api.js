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
const iex = require('../utils/dataIEX');
const mongo = require('../utils/dbMongo');
const assert = require('assert');

module.exports = function (app) {

  app.route('/api/stock-prices').get(async (req, res, next) => {
    
    try {

      const iexData = await iex.getStockAndPriceData(req.query.stock, next);
      const client = await mongo.connect(); 
      const db = client.db(); 
      const coll = db.collection("likedstocks");
      const isLiked = req.query.like;
      
      const stockData = await Promise.all(

        iexData.map(async (obj) => {
          
          const promise = await coll.findOne({stock: obj.stock})
            .then(isFound => (
              isLiked 
                ? coll.findOneAndUpdate({stock: obj.stock}, { 
                      $inc: {likes: (isFound && isFound.ips.indexOf(req.ip) >= 0 ? 0 : 1)},
                      $addToSet: {ips: req.ip}
                    }, 
                    {upsert: true, returnOriginal: false})
                    .then(result => {
                      const {stock, likes} = result.value;
                      return {stock, price: obj.price, likes};
                    })
                : isFound 
                  ? {stock: isFound.stock, price: obj.price, likes: isFound.likes}
                  : {stock: obj.stock, price: obj.price, likes: 0}
            ));

          return promise;
        })

      ).then(dataArr => ({
        stockData: dataArr.length === 1
          ? dataArr[0] 
          : (dataArr.map((obj, i, dataArr) => {
              const {stock, price, likes} = obj;
              return {stock, price, rel_likes: (likes - dataArr[(dataArr.length - 1 - i)].likes)}
            }))
      }));

      mongo.close(client);
      
      res.send(stockData);

    } catch (err) {
      console.log('Error:', err.message);
      next(err);
    }

  });
    
};

