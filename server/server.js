const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

//require helper functions
const { createMessage } = require('./utils/message');

//Middlewares
app.use(cors());
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    //emit -> instead of listening to an event, it is creating an event
    socket.on('onUserJoin', (userName) => {
        socket.emit('welcomeGreeting', createMessage('Admin', 'Welcome to the chat app!'));    //for individual user

        //broadcast to everyone except the user
        socket.broadcast.emit('welcomeGreeting', createMessage('Admin', `${userName} has joined the chatroom!`));   
    });

    //Event acknowledgments 
    socket.on('createMessage', (messageData, callback) => {
        io.emit('newMessage', createMessage(messageData.from, messageData.text));
        callback('This is from the server!');   //acknowledgment (serves as a server response)
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