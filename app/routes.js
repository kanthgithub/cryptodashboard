//create express router
const express = require('express'),
        router = express.Router(),
        mainController = require('./controllers/main.controller'),
        marketdataController = require('./controllers/marketdata.controller'),
        tickerdataController = require('./controllers/tickerdata.controller');

//define routes
router.get('/',mainController.showHome);

router.get('/marketdata',marketdataController.showMarketData);

router.get('/tickerdata',tickerdataController.getTickerData);

//export Router
module.exports = router;
