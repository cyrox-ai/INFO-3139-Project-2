import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

/* Material UI & Styling */

import {
    createTheme,
    ThemeProvider,
} from "@mui/material";

// Replace yourColor with a color from https://mui.com/material-ui/customization/color/#playground
import { red } from "@mui/material/colors";
import "./App.css";

const theme = createTheme({
    palette: {
        primary: {
          	// Or with a hex value from https://m2.material.io/inline-tools/color/
            main: red[900]
        }
    }
});

/* Components */
import Header from "./components/Header";
import Chat from "./components/Chat";
import Login from "./components/Login";

/* App Component */

function App() {
    /* Login */
    const [joinInfo, setJoinInfo] = useState({
        userName: '',
        roomName: '',
        error: ''
    });

    
    const hasJoined = () => joinInfo.userName && joinInfo.roomName && !joinInfo.error;
    const joinRoom = (joinData) => {
        if (!socket.current.connected) socket.current.connect();
        socket.current.emit("join", joinData);
    };
    const leaveRoom = () => {
        socket.current.disconnect();
        setJoinInfo({ userName: '', roomName: '', error: '' });
        setChatLog([]);
    };

    /* Chat */
    const [chatLog, setChatLog] = useState([]);
    const [roomUsers, setRoomUsers] = useState([]);
    const sendMessage = (text) => {
        socket.current.send(text);
    }

    /* WebSocket */
    // https://react.dev/reference/react/useRef
    // useRef is a React Hook that lets you reference a value that’s not needed for rendering
    const effectRan = useRef(false);
    const socket = useRef();

    const connectToServer = () => {
        if (effectRan.current) return; // Don't run twice with Strict Mode

        try {
            // Only use localhost:9000 if the app is being hosted on port 5173 (i.e. Vite)
            const wsServerAddress = window.location.hostname == "localhost" ? "localhost:9000" : "/";
            const ws = io.connect(wsServerAddress, { transports: ["websocket"] });

            // Handle join
            ws.on("join-response", setJoinInfo)

            // Handle chat
            ws.on("chat update", setChatLog);
            
            // Handle room users
            ws.on("room-users", setRoomUsers);

            socket.current = ws;
            effectRan.current = true; // Flag to prevent connecting twice
        }
        catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        connectToServer();
    }, []);

	/* App Rendering */

    return (
        <ThemeProvider theme={theme}>
            <Header title="Cool People Only - Aiden Anderson" />
            {
                hasJoined() ?
                    <Chat {...joinInfo} sendMessage={sendMessage} chatLog={chatLog} leaveRoom={leaveRoom} roomUsers={roomUsers}/>
                    : <Login joinRoom={joinRoom} error={joinInfo.error} />
            }
        </ThemeProvider>
    );
}

export default App;