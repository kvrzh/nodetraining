//includes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./libs/logger.js');
var errorhandler = require('errorhandler');
var mongoose = require('./libs/mongoose.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var config = require('./config');
var app = express();

//routes
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var chat = require('./routes/chat');

var app = express();
require('./socket')(app);
// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//loggers methods, logConsole to log in console and logFile to log in file (/logs/file.log)
app.use(logger.logConsole);
app.use(bodyParser());
//sessions and cookies

app.use(cookieParser());

var sessionStore = require('./libs/sessionStore');

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  store: sessionStore 
}));



app.use(express.static(path.join(__dirname, 'public')));
/*app.use(function(req, res, next){
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  res.send('Посещение '+ req.session.numberOfVisits);
});*/
app.use(require('./middlewares/sendHttpError'));
app.use(require('./middlewares/loadUser'));
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/chat', chat);




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
