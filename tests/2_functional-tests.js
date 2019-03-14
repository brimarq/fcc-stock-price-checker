/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      let firstLikesNum, aRelLikes, bRelLikes;

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          const {stock, price, likes} = res.body.stockData;
          assert.equal(stock, "GOOG");
          assert.isString(price);
          assert.match(price, /[\d.]+/);
          assert.isNumber(likes);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          const {stock, likes} = res.body.stockData;
          firstLikesNum = likes;
          assert.equal(stock, "AAPL");
          assert.isAtLeast(likes, 1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          const {stock, price, likes} = res.body.stockData;
          assert.equal(stock, "AAPL");
          assert.equal(likes, firstLikesNum);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['aapl', 'msft']})
        .end(function(err, res){
          const [a, b] = res.body.stockData;
          const keys = ['stock', 'price', 'rel_likes'];
          aRelLikes = a.rel_likes;
          bRelLikes = b.rel_likes;
          assert.isArray(res.body.stockData);
          assert.isObject(a);
          assert.isObject(b);
          assert.hasAllKeys(a, keys);
          assert.hasAllKeys(b, keys);
          assert.equal(a.stock, "AAPL");
          assert.equal(b.stock, "MSFT");
          assert.match(a.price, /[\d.]+/);
          assert.isNumber(b.rel_likes);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['aapl', 'msft'], like: true})
        .end(function(err, res){
          const [a, b] = res.body.stockData;
          assert.approximately(a.rel_likes, aRelLikes, 1);
          assert.approximately(b.rel_likes, bRelLikes, 1);
          done();
        });
      });
      
    });


});
