//grab dependencies
require('dotenv').config();


const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    expressLayouts = require('express-ejs-layouts');


let morgan = require('morgan');

//don't show the log when it is test
if(process.env.nodeEnvironment !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});



//configure application
var logger = require('morgan');
var bodyParser = require('body-parser');

app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


//set the routes
app.use(require('./app/routes'));
app.use(expressLayouts);


// view engine setup
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var cookieParser = require('cookie-parser');

app.use(cookieParser());

//tell express on where to look for static-assets
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

var createError = require('http-errors');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//import ticker data from coinbase-API to database
var refreshTool = require("./app/controllers/tickerdata.controller");
refreshTool.loadTickerData();


//start server
app.listen(port,() => {

    console.log(`cryptodashboard App listening on http://localhost:${port}`);

});


module.exports = app;
