var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var log           = require('logbootstrap');

var indexRouter   = require('./routes/index');

// var oreID         = require('oreid-auth');
var dotenv        = require('dotenv');

dotenv.config();

var app = express();

/*
const { 
  OREID_APP_ID, 
  OREID_API_KEY, 
  OREID_SERVICE_KEY, 
  OREID_URL 
} = process.env;

auth = oreID.init({
  appID: OREID_APP_ID,
  ApiKey: OREID_API_KEY,
  ServiceKey: OREID_SERVICE_KEY,
  url: OREID_URL
});

app.locals.auth = auth
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 
  extended: false 
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/moment', express.static(__dirname + '/node_modules/moment'));
app.use('/lodash', express.static(__dirname + '/node_modules/lodash'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/popperjs', express.static(__dirname + '/node_modules/@popperjs%2fcore/dist/cjs'));

app.use('/', indexRouter);
/*
app.use('/signcallback', auth.signCallback());
app.use('/authcallback', auth.authCallback(), indexRouter);
*/

// ---------------------------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
