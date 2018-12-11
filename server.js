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

// hard coded configuration object
conf = {
    // look for PORT environment variable,
    // else look for CLI argument,
    // else use hard coded value for port 8080
    port: process.env.PORT || process.argv[2] || 8080,

    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {

        if (!req.headers.origin) {

            res.json({

                mess: 'Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined'

            });

        } else {

            next();

        }

    },

    // Cross Origin Resource Sharing Options
    cors: {

        // origin handler
        origin: function (origin, cb) {

            // setup a white list
            let wl = ['http://localhost:3000','socket.io'];

            if (wl.indexOf(origin) != -1) {
                console.log("whitelisted origin: "+origin)
                cb(null, true);

            } else {

                cb(new Error('invalid origin: ' + origin), false);

            }

        },

        optionsSuccessStatus: 200

    }

};

// use origin undefined handler, then cors for all paths
app.use(cors(conf.cors));


var allowCrossDomain = function(req, res, next) {
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');


    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);

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

//import ticker data from coinmarketcap-API to database
var refreshTool = require("./app/controllers/tickerdata.controller");
refreshTool.loadTickerData();

module.exports = app;
