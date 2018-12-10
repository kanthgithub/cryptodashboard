const marketDataRef = require('../models/marketdata.model')

const CoinMarketCap = require('coinmarketcap-api')
const apiKey = process.env.COINMARKET_API_KEY
const client = new CoinMarketCap(apiKey)


module.exports = {

    publishMarketDataSnapshot: (preferences,connection) => {

        if(!preferences){
            preferences =process.env.defaultPreferences;
        }

        var marketData;

        client.getQuotes({symbol: preferences})
            .then((apiResponse) => {
                marketData = module.exports.translateMarketDataWithPreferences(apiResponse,preferences);
                console.log("marketData extracted in service: "+JSON.stringify(marketData));
                 connection.send(JSON.stringify(marketData));
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


};