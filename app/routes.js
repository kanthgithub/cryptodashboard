//create express router
const express = require('express'),
        router = express.Router(),
        mainController = require('./controllers/main.controller');

//export Router
module.exports = router;

//define routes
router.get('/',mainController.showHome);
