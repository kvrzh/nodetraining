//index.js
var nconf = require('nconf');
var path = require('path');

nconf.argv()
	.env()
	.file({ file: path.join(__dirname,'config.json') });

nconf.set('database:port', 5984);

module.exports = nconf;