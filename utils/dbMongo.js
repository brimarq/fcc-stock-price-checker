'use strict';
require('dotenv').config(); // comment-out on Glitch
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const promiseConnect = () => (
  new Promise((resolve, reject) => (
    MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
      assert.equal(null, err);
      // console.log("Connected correctly to MongoDB server");
      resolve(client);
    })
  ))
);

module.exports = {

  connect: async () => {
    let client = await (promiseConnect());
    return client;
  },

  close: async (client) => {
    client.close();
    // console.log("Closed connection to MongoDB server");
    return true; 
  } 

};
