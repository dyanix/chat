const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        removeUserFromRooms(socket);
    });

    socket.on('join room', ({ roomId, username }) => {
        console.log("roomId, username", roomId, username);
        removeUserFromRooms(socket);
        socket.join(roomId);
        addUserToRoom(socket, roomId, username);
    });

    socket.on('chat message', (msg) => {
        console.log("rooms: ", rooms);
        const roomId = getRoomIdBySocket(socket);
        const username = getUsernameBySocket(socket);
        console.log("roomId: ", roomId, "username", username)
        console.log("msg", msg)
        if (roomId && username) {
            console.log('Message:', msg);
            io.to(roomId).emit('chat message', { username, message: msg });
        }
    });
});

function addUserToRoom(socket, roomId, username) {
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }
    rooms[roomId].push({ socketId: socket.id, username });
}


function removeUserFromRooms(socket) {
    for (const roomId in rooms) {
        const index = rooms[roomId].findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            rooms[roomId].splice(index, 1);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }
    }
}

function getUsernameBySocket(socket) {
    for (const roomId in rooms) {
        const user = rooms[roomId].find((user) => user.socketId === socket.id);
        if (user) {
            return user.username;
        }
    }
    return null;
}

function getRoomIdBySocket(socket) {
    for (const roomId in rooms) {
        const user = rooms[roomId].find((user) => user.socketId === socket.id);
        if (user) {
            return roomId;
        }
    }
    return null;
}


http.listen(5500, () => {
    console.log('Server listening on port 3000');
});