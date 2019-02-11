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
    // socket.emit
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});