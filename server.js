//grab dependencies
require('dotenv').config();
require("babel-polyfill");

// Configuring the database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...'+err);
    process.exit();
});

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    expressLayouts = require('express-ejs-layouts');


const cors = require('cors');

app.use(cors({origin: '*'}));


let morgan = require('morgan');

//don't show the log when it is test
if(process.env.nodeEnvironment !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


//configure application
var logger = require('morgan');
var bodyParser = require('body-parser');

app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


//set the routes
app.use(require('./app/routes/routes'));
app.use(expressLayouts);


const errorHandler = require('./app/authentication/error-handler');

// global error handler
app.use(errorHandler);

// view engine setup
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));

//express-json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookie parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//tell express on where to look for static-assets
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//unhandled Rejection (GlobalRejectionHandler)
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error.message);
});

//import market Streamer

const http = require('http');

const httpServer = http.createServer(app);

const WebSocket =  require('websocket');

const wss = new WebSocket.server({
    'httpServer': httpServer
});

httpServer.listen(port)

var marketStreamer = require("./app/service/marketdataStreamer");
marketStreamer.startWebSocketServer(wss);

//import ticker data from coinbase-API to database
var refreshTool = require("./app/controllers/tickerdata.controller");
refreshTool.loadTickerData();


module.exports = app;
