//includes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./libs/logger.js');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var config = require('./config');

//routes
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//loggers methods, logConsole to log in console and logFile to log in file (/logs/file.log)
app.use(logger.logConsole);

//sessions and cookies
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key')
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middlewares/sendHttpError'));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err,req,res,next){
  if(typeof err == "number"){
    err = new HttpError(err);
  }

  if(err instanceof HttpError){
    res.sendHttpError(err);
  }else{
    if(app.get('env') == 'development'){
      errorhandler()(err,req,res,next);
    }else{
      console.log(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
})


module.exports = app;
