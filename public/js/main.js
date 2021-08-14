const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const clientSocket = io();

// Join chatroom - can catch on server side
clientSocket.emit('join-room', { username, room });

// Get room and users
clientSocket.on('room-user', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})
// Message from server
clientSocket.on('message', (payload) => {
	outputMessage(payload);

    // Scrolls down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// getting message text from chat box
	const msg = e.target.elements.msg.value;

	// emitting the message to the server
	clientSocket.emit('chat-message', msg);
    
    // clears message box after message is sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(payload) {
	const message = document.createElement('div');
	message.classList.add('message'); // such that, the div's class is message
	message.innerHTML = `
        <p class="meta">${payload.username} <span>${payload.time}</span></p>
        <p class="text">
            ${payload.text}
        </p>
    `;
    const chatMessagesDiv = document.querySelector('.chat-messages');
    chatMessagesDiv.appendChild(message);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
