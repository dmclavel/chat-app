const socket = io();   //initiate request from the client to the server

function scrollToBottom () {
    //Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');

    //Heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

function parseUrlParams () {
    let params = window.location.search;
    let paramsObject = {};

    //Replace ? with empty string and split multiple params
    params = params.replace(/^\?/, '').split('&');
    
    for (let i=0; i < params.length; i++) {
        const param = decodeURIComponent(params[i]).split('=');
        for (let j=0; j < param.length; j++) {
            const key = param[0].replace(/[\+]/g, ' ');
            const value = param[1].replace(/[\+]/g, ' ');   //replace all occurences of +

            paramsObject[key] = value.trim();   //remove only trailing spaces
        }
    } 

    return paramsObject;
}
        
socket.on('connect', function () {
    console.log('Connected to server!');

    const params = parseUrlParams();

    socket.emit('join', params, function (error) {
        if (error) {
            alert(error);
            return window.location.href = '/';
        }   
        
        //else if successful joining
        socket.join(params.room);   //a socket io feature -> socket,leave to room
    });

    socket.emit('onUserJoin', 'A user');

    socket.on('newMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm A');
        const template = jQuery('#message-template').html();
        const html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });

        jQuery('#messages').append(html);
        scrollToBottom();
    });

    socket.on('newLocationMessage', function (message) {
        const formattedTime = moment(message.createdAt).format('h:mm A');
        const template = jQuery('#location-message-template').html();
        const html = Mustache.render(template, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });

        jQuery('#messages').append(html);
        scrollToBottom();
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

socket.on('updateUserList', function (users) {
    const ul = jQuery('<ul></ul>');

    users.forEach(function (user) {
        ul.append(jQuery('<li></li>').text(user));
    });

    jQuery('#online-users').html(ul);
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