const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const axios = require('axios');
const dotenv = require('dotenv');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { Users } = require('./utils/users');
const port = process.env.PORT || 3000;

//require helper functions
const { createMessage, createLocationMessage } = require('./utils/message');
const { instanceOfString } = require('./utils/validation');

//Load environment variables
dotenv.load();

//Instantiate Users
const users = new Users();

//Middlewares
app.use(cors());
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected!');

    //Event acknowledgments 
    socket.on('createMessage', (messageData, callback) => {
        const user = users.getUser(socket.id);

        if (user !== [] && instanceOfString(messageData.text)) {
            io.to(user[0].room).emit('newMessage', createMessage(user[0].name, messageData.text));
        }

        callback('This is from the server!');   //acknowledgment (serves as a server response)
        /** Broadcasting **/
        // Will broadcast to other clients except yourself
        // socket.broadcast.emit('newMessage', {
        //     ...messageData,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('join', (params, callback) => {
        if (!instanceOfString(params.name) || !instanceOfString(params.room)) 
            callback('Only 25 characters are allowed for the display name and room name. Empty spaces not allowed.');
        else {
            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);

            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            //emit -> instead of listening to an event, it is creating an event
            socket.on('onUserJoin', (userName) => {
                socket.emit('welcomeGreeting', createMessage('Admin', 'Welcome to the chat app!'));    //for individual user

                //broadcast to everyone except the user
                socket.broadcast.to(params.room).emit('welcomeGreeting', createMessage('Admin', `${params.name} has joined the chatroom!`));   
            });
        }
    });

    socket.on('createLocationMessage', (coordinates) => {
        const user = users.getUser(socket.id);

        if (user !== []) {
            io.to(user[0].room).emit('newLocationMessage', createLocationMessage('Admin', coordinates.lat, coordinates.lng));
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const user = users.removeUser(socket.id);

        if (user !== []) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', createMessage('Admin', `${user.name} has left the chatroom!`));
        }
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});