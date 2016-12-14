//index.js
module.exports = function (app) {
    app.io = require('socket.io')();
    app.io.on('connection', function (socket) {
        console.log('New user');
        var name = 'Гость';
        socket.on('hello', function (name) {
            var text = '----Тварына, ' + name.name + ' зашел в чатик----';
            socket.broadcast.emit('message', text);
        });
        socket.on('message', function (message, cb) {
            socket.broadcast.emit('message', message.name + ': ' + message.text);
            cb && cb();
        });
    });
}
