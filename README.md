# fCC Information Security and Quality Assurance Projects: Stock Price Checker  

- Build a full stack JavaScript app that is functionally similar to this: https://giant-chronometer.glitch.me/.  
- Working on this project will involve you writing your code on Glitch on our starter project. After completing this project you can copy your public glitch url (to the homepage of your app) into this screen to test it! Optionally you may choose to write your project on another platform but must be publicly visible for our testing.  
- Start this project on Glitch using [this link](https://glitch.com/#!/import/github/freeCodeCamp/boilerplate-project-stockchecker/) or clone [this repository](https://github.com/freeCodeCamp/boilerplate-project-stockchecker/) on GitHub! If you use Glitch, remember to save the link to your project somewhere safe!  

---
1) SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2) Complete the project in `routes/api.js` or by creating a handler/controller
3) You will add any security features to `server.js`
4) You will create all of the functional tests in `tests/2_functional-tests.js`  

---

## User Stories  
* [ ] 1. Set the content security policies to only allow loading of scripts and css from your server.  
* [ ] 2. I can GET `/api/stock-prices` with form data containing a Nasdaq stock `ticker` and recieve back an object `stockData`.  
* [ ] 3. In `stockData`, I can see the `stock` (string, the ticker), `price` (decimal in string format), and `likes` (int).  
* [ ] 4. I can also pass along field `like` as `true` (boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.  
* [ ] 5. If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display `rel_likes` (the difference between the likes on both) on both.  
* [ ] 6. A good way to receive current price is the following external API(replacing 'GOOG' with your stock): ~~https:/<span>/finance.google.com/finance/info?q=NASDAQ%3aGOOG~~</span> <-- Scratch that. That API is dead. Try [IEX](https://iextrading.com/developer/docs/).  
* [ ] 7. All 5 functional tests are complete and passing.  

### Example usage:  
```js
/api/stock-prices?stock=goog  
/api/stock-prices?stock=goog&like=true  
/api/stock-prices?stock=goog&stock=msft  
/api/stock-prices?stock=goog&stock=msft&like=true  
```

### Example return:  
```js
{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}   
{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}  
```
