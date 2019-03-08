'use strict';
require('dotenv').config(); // comment-out on Glitch
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

module.exports = {
	
  /* 
   * Mongo Utility: Connect to client */

  connect: async () => (

    client = await (
      () => (new Promise((resolve, reject) => (

        MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, 
          (err, client) => {
            assert.equal(null, err);
            resolve(client);
          }
        )
      )))
    )()
  ),

  
  /* 
   * Mongo Utility: Close client */

  close: async (client) => {
    client.close();
    return true;
  }
};
