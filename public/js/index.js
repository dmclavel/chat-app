const socket = io();   //initiate request from the client to the server
        
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('onUserJoin', 'A user');

    socket.on('newMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm A');
        const li = jQuery('<li></li>');
        li.text(`${message.from} ${formattedTime}: ${message.text}`);

        jQuery('#messages').append(li);
    });

    socket.on('newLocationMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm A');
        const li = jQuery('<li></li>');
        const a = jQuery('<a target="_blank"> My current location </a>');

        li.text(`${message.from} ${formattedTime}: `);
        a.attr('href', message.url);
        li.append(a);
        jQuery('#messages').append(li);
    });

    socket.on('welcomeGreeting', function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm A');
        const li = jQuery('<li></li>');
        li.text(`${message.from} ${formattedTime}: ${message.text}`);

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
    alert('Disconnected from server!');
});

const sideBar = jQuery('#side-bar');
sideBar.on('click', function () {
    const leftSide = jQuery('.OnlineUsers')[0];
    if (leftSide.classList.length === 1)
        leftSide.classList.add('LeftSideAdd');
    else 
        leftSide.classList.remove('LeftSideAdd');
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        
    });
});

const locationButton = jQuery('#send-location');
const imgLocation = jQuery('#img-location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!');
    }

    locationButton[0].classList.add('DisabledButton');    
    imgLocation[0].classList.add('ShowGif');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton[0].classList.remove('DisabledButton'); 
        imgLocation[0].classList.remove('ShowGif');
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location.');
    });
});

const sendButton = jQuery('#send-message');

sendButton.on('click', function () {
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        
    });
    const textArea = document.getElementsByTagName('textarea');
    Array.from(textArea)[0].value = '';
});