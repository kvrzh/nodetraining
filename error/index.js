//index.js
'use strict'
var path = require('path');
var http = require('http');

class HttpError extends Error{
	constructor(status, message){
		super(status,message);
		Error.captureStackTrace(this, HttpError);
		this.status = status;
		this.message = message || http.STATUS_CODES[status] || "Error";
	}
}

HttpError.prototype.name = "HttpError";
exports.HttpError = HttpError;