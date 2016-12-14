//login.js
var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;
var AuthError = require('../models/user.js').AuthError;
var async = require('async');
var HttpError = require('../error').HttpError;

router.get('/', function (req, res, next) {
    res.render('login', {});
});

router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        } else {
            req.session.user = user._id;
            res.send({});
        }
    });
});

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;

