//create express router and import controllers to load , refresh and get market/ticker data
const express = require('express'),
        router = express.Router(),
        mainController = require('../controllers/main.controller'),
        marketdataController = require('../controllers/marketdata.controller'),
        tickerdataController = require('../controllers/tickerdata.controller'),
        userController = require('../controllers/users.controller');


//define routes
router.get('/',mainController.showHome);

//get latest marketInformation
router.get('/marketData',marketdataController.showMarketData);

//get ticker details available for marketUpdates
router.get('/tickerData',tickerdataController.getTickerData);

//load the tickerDetails from coinbase-API to mongodb
router.post('/loadTickerData', tickerdataController.loadTickerData);

//user registration , update and retrieval routes
router.post('/authenticateUser', userController.authenticate);

router.post('/registerUser', userController.register);

router.get('/users', userController.getAll);

router.get('/currentUser', userController.getCurrent);

router.get('/userById/:id', userController.getById);

router.put('/userById/:id', userController.update);

router.delete('/userById/:id', userController._delete);


//export Router
module.exports = router;
