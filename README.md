# Crypto Streaming API:

## Features:

- API to get the crypto-tickers from coinmarketcap API
- Streamer to stream marketdata snapshot for tickers


## Functional Flow:
      
  - Onload of the service, will load / update the tickerStatic
  - Tickerstatic is loaded from coinmarket cap API
  - Axios is the library used to make GET call from the API
      
 - references:      
      
   - COINMARKET_API_TICKER = https://api.coinmarketcap.com/v1/ticker
 
 
-Technical Details:
 
- Code snippets :
      
 ```js
   
  loadTickerData: () => {
    
            // Get all available coins from CoinMarketCap API.
            axios.get(process.env.COINMARKET_API_TICKER).then((apiResponse) => {
    
                if (apiResponse.status === 200) {
    
                    module.exports.persistTickerStaticData(apiResponse);
    
                }
            });
        }
 ```
        
        
  
  - coinmarketcap-api package 
   
    ```js
    const CoinMarketCap = require('coinmarketcap-api')
    ```
  
- API to get the marketdata snapshot of the preferred tickers choosen by user OR default tickers

  - Market data is extracted from coinmarketcap API call
  
- Websocket streaming of marketdata

  1. MarketdataStreamer picks the marketdata from API and caches in the local cache
  
  2. Each extraction of marketdata-snapshot will compare the results with cached data
 
     - If there is any price change, then the corresponding increase/decrease of price will be marked as indicator
     - A Px increase will make boolean indicator 'goingup' as true, and viceversa, fall in Px will set indicator 'goingdown'
     - Default would be false for both
     
     ```js
     
        var apicacheData = mcache.get(apiResponseEntity.symbol);

        var marketDataEntityObject = new marketDataRef();

        marketDataEntityObject.goingup = false;
        marketDataEntityObject.goingdown = false;

        if(apicacheData){

            var oldPx = apicacheData.price;

            var newPx = apiResponseEntity.quote.USD.price;

            if(oldPx && newPx) {

                if (newPx > oldPx) {
                    marketDataEntityObject.goingup = true;
                    marketDataEntityObject.goingdown = false;
                } else if (newPx < oldPx) {
                    marketDataEntityObject.goingup = false;
                    marketDataEntityObject.goingdown = true;
                }
            }
        }

      ```
     
  3. Clients can subscribe to websocket notifications 
  
     - Websocket pushes marketdata snapshot at regular intervals to all connections
     
     ```js
                
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

     ```
     
  4. to check the live updates, subscribe to:  
  
     wss://crytpostreamingapi.herokuapp.com
     
  5. Use a websocket client from browser or use socket-io client or any prefered client to listen/subscribe to marketdata
  
  
           



## API to get the real-time crypto-market data

## Cloud endpoints for API:

https://cryptostreamingapi.herokuapp.com/tickerData

- sample response:

```js
[
    {
        "maximumSupply": "2100000000",
        "totalSupply": "1741418700",
        "availableSupply": "1741418700",
        "_id": "5c0d1180b350ae904de8eac6",
        "id": "bitcoin",
        "name": "Bitcoin",
        "symbol": "BTC",
        "rank": 1,
        "createdAt": "2018-12-09T12:58:40.544Z",
        "updatedAt": "2018-12-11T16:33:54.946Z",
        "__v": 0
    },
    {
        "maximumSupply": null,
        "totalSupply": "10369293000",
        "availableSupply": "10369293000",
        "_id": "5c0d1180b350ae904de8eac8",
        "id": "ethereum",
        "name": "Ethereum",
        "symbol": "ETH",
        "rank": 3,
        "createdAt": "2018-12-09T12:58:40.544Z",
        "updatedAt": "2018-12-11T16:33:54.970Z",
        "__v": 0
    }

```

https://cryptostreamingapi.herokuapp.com/marketData?preferences=BTC,ETH,XRP

- Preferences can contain any number of cryptos. they should be comma separated

- Default would be configured in the .env property and top 3 tickers would be listed


- Sample Response

```js
[
    {
        "symbol": "BTC",
        "marketdata": {
            "id": 1,
            "circulating_supply": "17417687",
            "total_supply": "17417687",
            "max_supply": "21000000",
            "num_market_pairs": "6673",
            "cmc_rank": 1,
            "price": 3403.29625859,
            "volume_24h": 4664757187.45535,
            "percent_change_1h": -0.13267,
            "percent_change_24h": -3.26684,
            "percent_change_7d": -14.6379,
            "market_cap": 59277549000.39168,
            "_id": "5c0fe7a5bdd8bd0004b02fe4",
            "name": "Bitcoin",
            "symbol": "BTC",
            "slug": "bitcoin",
            "date_added": "2013-04-28T00:00:00.000Z",
            "tags": "mineable",
            "platform": null,
            "last_updated": "2018-12-11T16:35:21.000Z"
        }
    },
    {
        "symbol": "ETH",
        "marketdata": {
            "id": 1027,
            "circulating_supply": "103735000",
            "total_supply": "103735000",
            "max_supply": null,
            "num_market_pairs": "4764",
            "cmc_rank": 3,
            "price": 88.0894825748,
            "volume_24h": 1653637667.30245,
            "percent_change_1h": -0.410828,
            "percent_change_24h": -3.70341,
            "percent_change_7d": -20.8579,
            "market_cap": 9137962480.31438,
            "_id": "5c0fe7a5bdd8bd0004b02fe5",
            "name": "Ethereum",
            "symbol": "ETH",
            "slug": "ethereum",
            "date_added": "2015-08-07T00:00:00.000Z",
            "tags": "mineable",
            "platform": null,
            "last_updated": "2018-12-11T16:35:15.000Z"
        }
    },
    {
        "symbol": "XRP",
        "marketdata": {
            "id": 52,
            "circulating_supply": "40926963305",
            "total_supply": "99991757426",
            "max_supply": "100000000000",
            "num_market_pairs": "290",
            "cmc_rank": 2,
            "price": 0.29879329725,
            "volume_24h": 400963676.54638,
            "percent_change_1h": -0.217655,
            "percent_change_24h": -1.20621,
            "percent_change_7d": -15.9219,
            "market_cap": 12228702312.330706,
            "_id": "5c0fe7a5bdd8bd0004b02fe6",
            "name": "XRP",
            "symbol": "XRP",
            "slug": "ripple",
            "date_added": "2013-08-04T00:00:00.000Z",
            "tags": "",
            "platform": null,
            "last_updated": "2018-12-11T16:36:03.000Z"
        }
    }
]


```

<h3>Local deployment:</h3>
<ol>
  <li>Enter command line</li>
  <li>Clone repository: <code>git clone https://github.com/kanthgithub/cryptodashboard.git</code></li>
  <li>Enter repository: <code>cd cryptodashboard</code></li>
  <li>Install packages: <code>npm install</code></li>
  <li>Run with: <code>npm start</code></li>
  <li>Browse: <code>http://127.0.0.1:3000</code></li>
</ol>


## Dependencies:

- body-parser: This will add all the information we pass to the API to the request.body object.
- bcrypt: We'll use this to hash our passwords before we save them our database.
- dotenv: We'll use this to load all the environment variables we keep secret in our .env file.
- jsonwebtoken: This will be used to sign and verify JSON web tokens.
- mongoose: We'll use this to interface with our mongo database.
- expressJS: web framework for nodeJS (REST-API)
- websocket: 
- mcache: memory cache , used to cache the last extracted marketDataentry per crypto



## Development dependencies

- morgan: This will log all the requests we make to the console whilst in our development environment.
- nodemon: We'll use this to restart our server automatically whenever we make changes to our files.
- cross-env: This will make all our bash commands compatible with machines running windows.

## Test Dependencies

- mocha: javascript framework for Node.js which allows Asynchronous testing.
- chai: assertion library for tests

## TODO:

- Tests end to end
- User Preference Registration
- API authentication via JWT token