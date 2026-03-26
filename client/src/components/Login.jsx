import { useState } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert,
} from "@mui/material";

import logo from '../assets/Hypixel-Emblem.png';

const Login = (props) => {

    const [roomName, setRoomName] = useState("");
    const [userName, setUserName] = useState("");

    return (
        <Paper elevation={4} sx={{ mt: "0.5em" }}>
            <CardContent>
                <CardHeader title="Join a Room" />
                <img src={logo} alt="Hypixel Logo" width="200"></img>
                <TextField fullWidth label="User Name" value={userName} onChange={e => setUserName(e.target.value)}
                    sx={{ mb: "1em" }}
                />
                <TextField fullWidth label="Room Name" value={roomName} onChange={e => setRoomName(e.target.value)}
                    sx={{ mb: "1em" }}
                />
                <Button fullWidth variant="contained" disabled={!roomName || !userName}
                    onClick={() => props.joinRoom({ roomName, userName })}
                >
                    Join Room
                </Button>
            </CardContent>
			{props.error && <Alert severity="error">{props.error}</Alert>}
        </Paper>
    );
};

export default Login;