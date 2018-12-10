var http = require('http');
var server = require('websocket').server;
const CoinMarketCap = require('coinmarketcap-api')
const apiKey = process.env.COINMARKET_API_KEY
const client = new CoinMarketCap(apiKey)
const marketDataRef = require('../models/marketdata.model')


module.exports = {

    startWebSocketServer : () => {

        var connections = new Set(); // Storage of connections

        var socket = new server({
            httpServer: http.createServer().listen(process.env.WS_PORT)
        });

        console.log("WebSocket running on ws://localhost:"+process.env.WS_PORT);

        initInterval();

        socket.on('request', function(request) {
            var connection = request.accept(null, request.origin);

            connections.add(connection);

            module.exports.publishMarketDataSnapshot(null,connections);

            connection.on('close', function() {
                connections.delete(connection);
            });

        });

        function initInterval(){

            setInterval(function(){

                if(connections){
                    module.exports.publishMarketDataSnapshot(null,connections);
                    };
            }, 30000);
        };
    },


    publishMarketDataSnapshot: (preferences,connections) => {

        if(!preferences){
            preferences =process.env.defaultPreferences;
        }

        var marketData;

        client.getQuotes({symbol: preferences})
            .then((apiResponse) => {
                marketData = module.exports.translateMarketDataWithPreferences(apiResponse,preferences);
                var jsonResponse = JSON.stringify(marketData);

                connections.forEach(function (connection) {
                    connection.send(jsonResponse);
                });
            })
            .catch((error) => {console.log("error while extracting marketData: "+error); response.send("{}")});

    },

    translateMarketDataWithPreferences:  (apiResponse, preferences) => {

        let preferencesArray = preferences.split(",");

        return preferencesArray.map((preference) => {
            var marketDataEntityObject = module.exports.translateAPIResponseWithPreferences(apiResponse, preference);

            return {
                symbol: preference,
                marketdata: marketDataEntityObject
            }
        });

    },

    translateAPIResponseWithPreferences: function (apiResponse, preference) {
        let apiResponseEntity = apiResponse.data[preference]

        var marketDataEntityObject = new marketDataRef();
        marketDataEntityObject.id = apiResponseEntity.id;
        marketDataEntityObject.name = apiResponseEntity.name;
        marketDataEntityObject.symbol = apiResponseEntity.symbol;
        marketDataEntityObject.slug = apiResponseEntity.slug;
        marketDataEntityObject.circulating_supply = apiResponseEntity.circulating_supply;
        marketDataEntityObject.total_supply = apiResponseEntity.total_supply;
        marketDataEntityObject.max_supply = apiResponseEntity.max_supply;
        marketDataEntityObject.date_added = apiResponseEntity.date_added;
        marketDataEntityObject.num_market_pairs = apiResponseEntity.num_market_pairs;
        marketDataEntityObject.tags = apiResponseEntity.tags;
        marketDataEntityObject.platform = apiResponseEntity.platform;
        marketDataEntityObject.cmc_rank = apiResponseEntity.cmc_rank;
        marketDataEntityObject.last_updated = apiResponseEntity.last_updated;
        marketDataEntityObject.price = apiResponseEntity.quote.USD.price;
        marketDataEntityObject.volume_24h = apiResponseEntity.quote.USD.volume_24h;
        marketDataEntityObject.percent_change_1h = apiResponseEntity.quote.USD.percent_change_1h;
        marketDataEntityObject.percent_change_24h = apiResponseEntity.quote.USD.percent_change_24h;
        marketDataEntityObject.percent_change_7d = apiResponseEntity.quote.USD.percent_change_7d;
        marketDataEntityObject.market_cap = apiResponseEntity.quote.USD.market_cap;
        marketDataEntityObject.last_updated = apiResponseEntity.quote.USD.last_updated;

        return marketDataEntityObject;
    }


}
