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

    deleteTickers : tickerDataRef.deleteAllTickers(function(error,response){
        if(error){
            console.error("failed to cleanup tickerData");
        } else{
            console.log("successfully deleted tickerData");
            console.log(response);
        }
    }),


    loadTickerData: (request,response) => {

        // Get all available coins from CoinMarketCap API.
        axios.get(process.env.COINMARKET_API).then((apiResponse) => {

            if (apiResponse.status === 200) {


              setTimeout( deleteTickers ,100),

                tickerDataRef.getAllTickers(function (error,response) {
                   if(error){
                       console.log('no tickers');
                   } else{
                       console.log('tickerdata extracted: '+response);
                   }
                });

                let coins = {};

                apiResponse.data.map((coin) => {
                    coins[coin.symbol] = coin

                    var tickerdataEntityObject = new tickerDataRef();
                    tickerdataEntityObject.id=coin.id;
                    tickerdataEntityObject.name = coin.name;
                    tickerdataEntityObject.symbol = coin.symbol;
                    tickerdataEntityObject.rank = coin.rank;
                    tickerdataEntityObject.maximumSupply = coin.maximumSupply;
                    tickerdataEntityObject.totalSupply = coin.totalSupply;
                    tickerdataEntityObject.availableSupply = coin.availableSupply;

                    console.log('saving tickerdataEntity: '+tickerdataEntityObject);

                    tickerdataEntityObject.save();

                    return null
                });


            }
        });
    }

}