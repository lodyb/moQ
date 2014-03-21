var express = require('express');
var io = require('socket.io');
var server = require('http');
var path = require('path');
var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);
// Give the client access to the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));
// This is the server port.
server.listen(3000);
// When the socket connects...
io.sockets.on('connection', function(socket){
    // When a message is sent.
    socket.on('msg_send', function(data){
        // Send message to everyone except me.
        socket.broadcast.emit('msg_new', data);
    });
});