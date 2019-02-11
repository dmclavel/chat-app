const socket = io();   //initiate request from the client to the server
        
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.on('newMessage', function (message) {
        console.log(message);
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});