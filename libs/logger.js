var FileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

var logDirectory = path.join(__dirname, '/../logs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

exports.logFile = morgan('combined', {stream: accessLogStream});
exports.logConsole = morgan('dev');

