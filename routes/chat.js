var express = require('express');
var router = express.Router();
var checkAuth = require('../middlewares/checkAuth.js');
/* GET home page. */
router.get('/', checkAuth, function (req, res, next) {
    res.render('chat');
});

module.exports = router;
