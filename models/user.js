//user.js
'use strict'
var crypto = require('crypto');
var async = require('async');

var mongoose = require('../libs/mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback){
  var User = this;
  console.log('start');
  async.waterfall([
  function(callback){
    User.findOne({username:username},callback);
  },
  function(user, callback){
    console.log('user');
    if(user){
      if(user.checkPassword(password)){
        callback(null, user);
      }else{
        callback(new AuthError("Пароль неверен"));
      }
    }else{
      var user = new User({username:username, password:password});
      user.save(function(err){
        if(err) return callback(err);
        console.log(user);
        callback(null, user);
      });
    }
  }],callback);
}

exports.User = mongoose.model('User', schema);


var path = require('path');
var http = require('http');

class AuthError extends Error{
  constructor(message){
    super(null,message);
    Error.captureStackTrace(this, AuthError);
    this.message = message ;
  }
}

AuthError.prototype.name = "AuthError";
exports.AuthError = AuthError;