var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// authentication requirements
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
//global.passport = passport;
var session = require('express-session');

//database requirements
require('./models/user.js');
require('./models/polls.js');
var mongoose = require('mongoose');
mongoose.connect("mongodb://ulisescabrera:mana1234@ds035485.mongolab.com:35485/voting-app-basejump");

var authenticate = require('./routes/authenticate.js')(passport);
var polls = require('./routes/polls.js');
var routes = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(session({
  secret: 'super voting polls'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('super voting polls'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/auth', authenticate);
app.use('/poll', polls);

// initialize passport
var initPassport = require('./config/passport-init');
initPassport(passport);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;