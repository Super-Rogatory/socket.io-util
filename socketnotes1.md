# Socket IO Notes - Part 1

## **Defining the web socket**
## [>] Websockets is a protocol that allows for bi-directional communication between client and server.
## [>] This means that a browser can connect to a server for a persistent connection (so both the client and the server can push data to each other)
## [>] Typically, with HTTP, the client makes a request and the server responses. With web sockets the client OR the server can initiate the communcation.

# Setup
## [>] Want to install socket.io and maybe moment.js for formatting the date and the time. **[server.js]**
- ## `npm install socket.io moment express`
## [>] Then, after you require in the socket.io module, you need to implement socket.io into your server.
```
const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 8080;

// Setting static folder
app.use(express.static(path.join(__dirname, '/public')));

// Run when a client connects
io.on('connection', (socket) => {
    console.log('new web socket connection...');
});

server.listen(PORT, () => console.log(`currently listening on PORT ${PORT}`))
```

## [>] We need to include socket.io into our html file so the main.js will have access to the necessary components. (This isn't the only way to do this) **[chat.html]**
```
  <script src="/socket.io/socket.io.js"></script>
  <script src="js/main.js"></script>
```

## [>] Emitting the event. **[server.js]**
```
io.on('connection', (socket) => {
    console.log('new web socket connection...');

    // To the single client
    socket.emit('message', 'Welcome to ChatCord');

    // Broadcast when a user connects. To everybody except the user that has connected.
    socket.broadcast.emit('message', 'A user has joined the chat');

    // To all the clients in general || io.emit()
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    })
});
```

## [>] Listening for the event. **[main.js]**
```
const clientSocket = io();

clientSocket.on('message', (message) => {
    console.log(message);
})
```

- ### **NOTE: Our chat.html references two scripts. The first script is /socket.io/socket.io.js. This script allows our next script to have access to the functionality of socket.io.js. Our next script is main.js, which is the 'client' script (as it is loaded up by our html file), can now listen for events emitted from the server.**


