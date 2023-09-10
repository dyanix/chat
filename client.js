const socket = io();

const roomSelection = document.getElementById('room-selection');
const roomIdInput = document.getElementById('room-id');
const usernameInput = document.getElementById('username');
const joinRoomButton = document.getElementById('join-room');

const chatWindow = document.getElementById('chat-window');
const currentRoomSpan = document.getElementById('current-room');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('input-message');
const messagesList = document.getElementById('messages');

joinRoomButton.addEventListener('click', () => {
    const roomId = roomIdInput.value;
    const username = usernameInput.value;
    if (roomId && username) {
        socket.emit('join room', { roomId, username });
        roomSelection.style.display = 'none';
        chatWindow.style.display = 'block';
        currentRoomSpan.textContent = roomId;
    }
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

socket.on('chat message', (data) => {
    console.log("chat event fired");
    console.log(data);
    const { username, message } = data;
    const li = document.createElement('li');
    li.innerHTML = `<strong>${username}:</strong> ${message}`;
    messagesList.appendChild(li);
});