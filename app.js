var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var elasticClient = require('./config/elastic');
var passportSetup = require('./config/passport-setup');
var authRoutes = require('./routes/auth-routes');
var keys = require('./config/keys');
var constants = require('./config/constants');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//
var cookieSession = require('cookie-session');
app.use(cookieSession({
  maxAge: constants.session.timeout,
  keys:[keys.session.sessionKey]
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((request,response,next) => {
  var allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:4200'];
  var origin = request.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    response.header('Access-Control-Allow-Origin', origin);
  }
  response.setHeader('Content-Type', 'application/json');
  /*response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  */
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.header('Access-Control-Allow-Credentials', true);
  next();    
});

app.use("/auth",authRoutes);

//
app.use('/', index);
app.use('/users', users);

module.exports = app;
