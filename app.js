var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');

var indexRouter   = require('./routes/index');
var usersRouter   = require('./routes/users');

var cors          = require('cors')

var dotenv        = require('dotenv');
var firebase      = require('./firebase');

dotenv.config();

var app = express();

firebase.init();
app.locals.firebase = firebase;

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

app.use(cors());

// --------------------------------------------
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/moment', express.static(__dirname + '/node_modules/moment'));
app.use('/lodash', express.static(__dirname + '/node_modules/lodash'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/popperjs', express.static(__dirname + '/node_modules/@popperjs%2fcore/dist/cjs'));

app.use('/', indexRouter);
app.use('/auth', usersRouter);

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
  res.render('error', { 
    title: process.env.TITLE
  });
});

module.exports = app;
