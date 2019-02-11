const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    //emit -> instead of listening to an event, it is creating an event
    socket.on('onUserJoin', (userName) => {
        socket.emit('welcomeGreeting', {    //for individual user
            from: 'Admin',
            text: 'Welcome to the chat app!'
        });

        socket.broadcast.emit('welcomeGreeting', {  //broadcast to everyone except the user
            from: 'Admin',
            text: `${userName} has joined the chatroom!`,
            createdAt: new Date().getTime()
        });
    });

    socket.on('createMessage', (messageData) => {
        io.emit('newMessage', {
            ...messageData, 
            createdAt: new Date().getTime()
        });

        /** Broadcasting **/
        // Will broadcast to other clients except yourself
        // socket.broadcast.emit('newMessage', {
        //     ...messageData,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});