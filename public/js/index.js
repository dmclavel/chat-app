const socket = io();   //initiate request from the client to the server
        
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('onUserJoin', 'Daimler');

    socket.on('newMessage', function (message) {
        console.log(message);
        const li = jQuery('<li></li>');
        li.text(`${message.from}: ${message.text}`);

        jQuery('#messages').append(li);
    });

    socket.on('welcomeGreeting', function (message) {
        console.log(message);
        const li = jQuery('<li></li>');
        li.text(`${message.from}: ${message.text}`);

        jQuery('#messages').append(li);
    });

    // socket.emit('createMessage', {  //Acknowledgment
    //     from: 'Frank',
    //     text: 'Hi! :)'
    // }, function (response) {    //callback function to know if data are gotten back from the server
    //     console.log('Got the data! ', response);
    // });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        
    });
});