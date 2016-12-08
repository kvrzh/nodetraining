var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;
var HttpError = require('../error').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},function(err, users){
  	res.json(users);
  });
});
router.get('/:id', function(req, res, next){
	try{
		var id = new ObjectID(req.params.id);
	}catch(err){
		next(404);
		return;
	}
	User.findById(req.params.id,function(err, user){
		if(err) return next(err);
		if(!user){
			next(new HttpError(404,"User not found"));
		}else{
			res.json(user);
		}
		
	});
});
module.exports = router;
