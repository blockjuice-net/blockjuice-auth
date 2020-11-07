var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var oreID = require('oreid-auth');

import dotenv from 'dotenv';
dotenv.config();

const { 
  OREID_APP_ID, 
  OREID_API_KEY, 
  OREID_SERVICE_KEY, 
  OREID_URL 
} = process.env;

const { 
  AUTH_CALLBACK, 
  SIGN_CALLBACK, 
  BACKGROUND_COLOR 
} = process.env;

auth = oreID.init({
  appID: OREID_APP_ID,
  ApiKey: OREID_API_KEY
  ServiceKey: OREID_SERVICE_KEY
  url: OREID_URL
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', helpPrompt());

//handle sample oreid-enabled routes
app.use('/login/:logintype', loginHandler(auth.oreid));
app.use('/authcallback', auth.authCallback, displayUser());
app.use('/signcallback', auth.signCallback);

let loginHandler = (oreId) => {
  return asyncHandler(async function(req, res, next) {
    const provider = req.params.logintype;
    let authUrl = await oreId.getOreIdAuthUrl({ provider, callbackUrl: AUTH_CALLBACK, signCallbackUrl: SIGN_CALLBACK, backgroundColor: BACKGROUND_COLOR });
    //redirect browser
    res.redirect(authUrl);
  });

};

//display user state
function displayUser() {
  return function(req, res, next) {
    const { user } = req;
    if (user) {
      return res.status(200).json(user);
    }
  };
}

function helpPrompt() {
  return function(req, res, next) {
    let message = 'Start login flow using /login route. Try it like this: {http://yourserver:port}/login/facebook';
    return res.status(200).send(message);
  };
}

//Generic async handler for Express Middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ---------------------------------------------------

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

module.exports = app;
