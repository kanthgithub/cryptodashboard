const axios = require('axios');

module.exports = {

    getTickerData: (request,response) => {
        // Get all available coins from CoinMarketCap API.
        axios.get(process.env.COINMARKET_API).then((apiResponse) => {
            if (apiResponse.status === 200) {

                let coins = {};

                apiResponse.data.map((coin) => {
                    coins[coin.symbol] = coin
                    return null
                });

                response.send({"coins": coins});
            }
        });
    },

    loadTickerData: (request,response) => {

        // Get all available coins from CoinMarketCap API.
        axios.get(process.env.COINMARKET_API).then((apiResponse) => {

            if (apiResponse.status === 200) {

                let coins = {};

                apiResponse.data.map((coin) => {
                    coins[coin.symbol] = coin
                    return null
                });

                response.send({"coins": coins});
            }
        });
    }

}