'use strict';

const axios = require('axios');

module.exports = {

  getStockAndPriceData: async (stock) => {

    const getQuote = (symbol) => axios.get(
      'https://api.iextrading.com/1.0/stock/' + symbol + '/quote', 
      {params: {filter: 'symbol, latestPrice'}}
    );

    const datareq = typeof stock === 'string' 
      ? [getQuote(stock)] 
      : [getQuote(stock[0]), getQuote(stock[1])]
    ;

    const response = await axios.all(datareq)
      .then(axios.spread((res1, res2) => (res2 ? [res1.data, res2.data] : [res1.data])))
      .then(result => result.map(obj => ({stock: obj.symbol, price: obj.latestPrice.toString()}))
    );

    return response;

  }
	
};
