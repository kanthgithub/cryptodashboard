const CoinMarketCap = require('coinmarketcap-api')
const apiKey = process.env.COINMARKET_API_KEY
const client = new CoinMarketCap(apiKey)
const marketDataRef = require('../models/marketdata.model')
var mcache = require('memory-cache');

module.exports = {

    startWebSocketServer : (websocketserver) => {

        var connections = new Set(); // Storage of connections

        console.log("WebSocket running on :"+JSON.stringify(websocketserver));

        initInterval();

        websocketserver.on('request', function(request) {
            var connection = request.accept(null, request.origin);

            console.log("origin connection: "+request.origin);

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
            }, 300000);
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
                    console.log("sending message to connection: "+connection);
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

        console.log("apiResponse: "+JSON.stringify(apiResponse));

        let apiResponseEntity = apiResponse.data[preference]

        var apicacheData = mcache.get(apiResponseEntity.symbol);

        var marketDataEntityObject = new marketDataRef();

        marketDataEntityObject.goingup = false;
        marketDataEntityObject.goingdown = false;

        if(apicacheData){

            var oldPx = apicacheData.price;

            var newPx = apiResponseEntity.quote.USD.price;

            if(oldPx && newPx) {

                console.log("symbol: "+apiResponseEntity.symbol+" - comparing oldPx :"+oldPx+" vs newPx: "+newPx)

                if (newPx > oldPx) {
                    marketDataEntityObject.goingup = true;
                    marketDataEntityObject.goingdown = false;
                    console.log("symbol: "+apiResponseEntity.symbol+" is going-up")
                } else if (newPx < oldPx) {
                    marketDataEntityObject.goingup = false;
                    marketDataEntityObject.goingdown = true;
                    console.log("symbol: "+apiResponseEntity.symbol+" is going-down")
                }
            }
        }

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

        mcache.put(marketDataEntityObject.symbol,marketDataEntityObject,30000);

        return marketDataEntityObject;
    }


}
