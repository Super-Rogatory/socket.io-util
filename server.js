const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const PORT = process.env.PORT || 8080;
const BOT_NAME = 'ChatCord Bot';

// Setting static folder
app.use(express.static(path.join(__dirname, '/public')));

// Run when a client connects
io.on('connection', (socket) => {
	// join room logic from client
	socket.on('join-room', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// To the single client
		socket.emit('message', formatMessage(BOT_NAME, 'Welcome to ChatCord'));

		// Broadcast when a user connects. To everybody except the user that has connected.
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(BOT_NAME, `${user.username} has joined the chat`)
			);
        // Send users and room info
        io.to(user.room).emit('room-user', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
	});

	// Listen for incoming chat message
	socket.on('chat-message', (msg) => {
        const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});
	// Runs when client disconnects. To all clients
	socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit(
                'message',
                formatMessage(BOT_NAME, `${user.username} has left the chat`)
            );            
        }
        // Send users and room info
        io.to(user.room).emit('room-user', {
            room: user.room,
            users: getRoomUsers(user.room)
        });        
	});
});

server.listen(PORT, () => console.log(`currently listening on PORT ${PORT}`));
