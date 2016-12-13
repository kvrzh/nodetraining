//sessionStore.js
var express = require('express');
var mongoose = require('./mongoose.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
module.exports = sessionStore;