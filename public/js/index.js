const socket = io();   //initiate request from the client to the server
        
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('createEmail', {
        to: 'dmcbusinessapps@gmail.com',
        text: 'HEY THIS IS DAIMLER'
    });

    socket.on('newMessage', function (message) {
        console.log(message);
    });

    socket.emit('createMessage', {
        text: 'Hi this is from the HTML client!',
        from: 'HTML Client'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});