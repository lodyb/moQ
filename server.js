var express = require('express');
var io = require('socket.io');
var server = require('http');
var path = require('path');
var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);
displaynames = [];
// Give the client access to the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));
// This is the server port.
server.listen(3000);
// When the socket connects...
io.sockets.on('connection', function(socket){
    // When a new user connects:
    socket.on('new_user', function(data, callback){
        // Make sure display name doesnt exist already.
        if(displaynames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            // Put the displayname in the socket.
            socket.displayname = data;
            displaynames.push(socket.displayname);
            update_displaynames();
        }
    });
    function update_displaynames(){
        io.sockets.emit('displaynames', displaynames);
    }
    // When a message is sent.
    socket.on('msg_send', function(data){
        // Send message to everyone except me.
        socket.broadcast.emit('msg_new', {msg: data, nick: socket.displayname});
    });
    // When a user disconnects:
    socket.on('disconnect', function(data){
        if(!socket.displayname) return;
        displaynames.splice(displaynames.indexOf(socket.displayname), 1);
        update_displaynames();
    });
});