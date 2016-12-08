var mongoose = require('./libs/mongoose.js');
mongoose.set('debug',true);
var async = require('async');


console.log(mongoose.connection.readyState);

function open(callback){
	mongoose.connection.on('open',callback);
	console.log('done');
}
function dropDatabase(callback){
	var db = mongoose.connection.db;
	console.log('done');
	db.dropDatabase(callback);

}
function requireModels(callback){
    require('./models/user.js');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}
function createUser(callback){
    var User = require('./models/user.js').User;
    var users = [
        {username : 'kvrzh', password:'qweeqw'},
        {username : 'kvrzhh', password:'qweeqw'},
        {username : 'divan', password:'qweeqw'}
    ];
	async.each(users, function (userData, callback) {
        var user = new User(userData);
        console.log(user);
        user.save(callback);
    },callback);
}

async.series([
	open,
	dropDatabase,
    requireModels,
	createUser
	], function(err){
		console.log(arguments);
        mongoose.disconnect(callback);
	});