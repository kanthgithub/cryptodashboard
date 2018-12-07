const axios = require('axios');
const tickerDataRef = require('../models/tickerdata.model')
const Sync = require('sync');
const await = require('await');

module.exports = {

    getTickerData: (request,response) => {
        tickerDataRef.getAllTickers(
            function(error, tickers){
                if(!error){
                    response.send(tickers);
                }else{

                    if(error.kind === 'ObjectId') {
                        return response.status(404).send({
                            message: "tickerData not found"
                        });
                    }
                    return response.status(500).send({
                        message: "Error retrieving tickerdata with id "
                    });
                }
            })
    },

    loadTickerData: (request,response) => {

        console.log("attempting to cleanup data:")

        function cleanupTickerDataBeforeRefresh() {
            await(function () {
                tickerDataRef.deleteAllTickers(function (error, response) {
                    if (error) {
                        console.error("failed to cleanup tickerData");
                    } else {
                        console.log("successfully deleted tickerData");
                        console.log(response);
                    }
                })
            })
        }

        // Get all available coins from CoinMarketCap API.
        axios.get(process.env.COINMARKET_API).then((apiResponse) => {

            if (apiResponse.status === 200) {

                console.log("fetched API data - attempting to cleanup data and load fresh:")


                //blocking call to refresh ticker-data
                cleanupTickerDataBeforeRefresh();

                let coins = {};

                apiResponse.data.map((coin) => {
                    coins[coin.symbol] = coin

                    var tickerdataEntityObject = new tickerDataRef();
                    tickerdataEntityObject.id=coin.id;
                    tickerdataEntityObject.name = coin.name;
                    tickerdataEntityObject.symbol = coin.symbol;
                    tickerdataEntityObject.rank = coin.rank;
                    tickerdataEntityObject.maximumSupply = coin.max_supply;
                    tickerdataEntityObject.totalSupply = coin.total_supply;
                    tickerdataEntityObject.availableSupply = coin.available_supply;

                    console.log("loading fresh data:"+tickerdataEntityObject)


                    tickerdataEntityObject.save();
                });

            }
        });
    }

}