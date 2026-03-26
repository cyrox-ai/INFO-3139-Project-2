/* server.js */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as data from "./data.js";

// Reads PORT from the OS, the --env-file flag, or defaults to 9000
const PORT = process.env.PORT || 9000;

// The express server (configured, then passed to httpServer)
const app = express();

// Allows static hosting content of the public/ folder
// https://expressjs.com/en/api.html#express.static
app.use(express.static('public'));

// Parses incoming requests with JSON payloads
// https://expressjs.com/en/api.html#express.json
app.use(express.json());

// Custom application-level middleware for logging all requests
app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.log(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('body:', req.body);
    next();
});

// Creating an httpServer using the express configuration
// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const httpServer = http.createServer(app);

// New socket server
const io = new Server(httpServer);

// Socket event handling
io.on("connect", socket => {
    console.log("New connection", socket.id);

    // Client will have to emit "join" with joinInfo
    socket.on("join", joinInfo => {
        console.log(joinInfo);
        // The client has to be sending joinInfo in this format
        const { roomName, userName } = joinInfo;
        const joinTimestamp = new Date(Date.now()).toLocaleString();
        const joinTimestampInfo = { sender: '', text: `[${joinTimestamp}]` }

        if (data.isUserNameAvailable(userName)) {
            socket.data = joinInfo;
            socket.join(roomName);
            socket.on("disconnect", () => data.unregisterUser(userName));
            data.registerUser(userName);

            socket.on("message", text => {
                const { roomName, userName } = socket.data;
                const messageInfo = { sender: userName, text };
                const msgTimestamp = new Date(Date.now()).toLocaleString();
                const msgTimestampInfo = { sender: '', text: `[${msgTimestamp}]` }
                console.log(roomName, msgTimestampInfo)
                console.log(roomName, messageInfo);
                data.addMessage(roomName, msgTimestampInfo);
                data.addMessage(roomName, messageInfo);
                io.to(roomName).emit("chat update", data.roomLog(roomName));
            });

            data.addMessage(roomName, joinTimestampInfo);
            data.addMessage(roomName, { sender: '', text: `${userName} has joined room ${roomName}` });
            io.to(roomName).emit("chat update", data.roomLog(roomName));
        }
        else {
            joinInfo.error = `The name ${userName} is already taken`;
        }

        socket.emit("join-response", joinInfo);

        // Using socket.data to keep track of the new client identifier: userName
        socket.data.userName = userName; // keep track of unique user identifier

        // Add the socket to the roomName room
        socket.join(roomName);

        // socket.id is a "connection id" and works as a "single socket room" for direct messages
      	// socket.emit("joined", roomName); // equivalent call
        io.to(socket.id).emit("joined-room", roomName, userName);

        // Add your own event emit here
      	// So that clients on the room can be notified that a new user as joined
        socket.to(roomName).emit("user-joined", `${userName} has joined ${roomName}`);
    });
});

// Start the server listening on PORT, then call the callback (second argument)
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));