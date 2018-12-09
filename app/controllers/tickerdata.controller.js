const axios = require('axios');
const tickerDataRef = require('../models/tickerdata.model')

module.exports = {

    getTickerData: (request,response) => {

        tickerDataRef.getAllTickers().then(tickers => {response.send(tickers);})
            .catch(error => {
                if(error.kind === 'ObjectId') {
                    response.status(404).send({
                        message: "tickerData not found"
                    });
                }else{
                     response.status(500).send({
                        message: "Error retrieving tickerdata"
                    });
                }
            });
    },

    persistTickerStaticData:  (apiResponse) => {

        let coins = {};

        apiResponse.data.map((coin) => {
            coins[coin.symbol] = coin

            var tickerdataEntityObject = new tickerDataRef();
            tickerdataEntityObject.id = coin.id;
            tickerdataEntityObject.name = coin.name;
            tickerdataEntityObject.symbol = coin.symbol;
            tickerdataEntityObject.rank = coin.rank;
            tickerdataEntityObject.maximumSupply = coin.max_supply;
            tickerdataEntityObject.totalSupply = coin.total_supply;
            tickerdataEntityObject.availableSupply = coin.available_supply;

            tickerDataRef.saveOrUpdateEntity(tickerdataEntityObject);
        });
    },

    loadTickerData: () => {

        // Get all available coins from CoinMarketCap API.
        axios.get(process.env.COINMARKET_API_TICKER).then((apiResponse) => {

            if (apiResponse.status === 200) {

                module.exports.persistTickerStaticData(apiResponse);

            }
        });
    }



}