import { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    CardHeader,
    CardContent,
    Divider,
    Typography,
    TextField,
    Button,
    List,
} from "@mui/material";

import SendIcon from '@mui/icons-material/Send';

const Chat = (props) => {

    /* Chat Log */

    const lastMessageRef = useRef(null);
    const renderChatLog = () => {
        const chat = props.chatLog ?? [];
        return chat.map((message, index) => <div key={index}>
            <Typography ref={lastMessageRef} variant="h6" style={{textAlign: message.sender ? "left" : "center"}}>
                {
                    message.sender ?
                        `[${message.sender}] ${message.text}`
                        : `${message.text}`
                }
            </Typography>
        </div>);
    }

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [props.chatLog]);

    /* Send Message */

    const [messageText, setMessageText] = useState("");

    /* Render Component */

    return (
        <Paper elevation={4} sx={{ mt: "0.5em", display: "flex", flexDirection: "column" }}>
            <CardHeader title={`${props.roomName} (as ${props.userName})`} />
            <Divider />
            <CardContent>
                <List sx={{ height: "60vh", overflowY: "scroll", textAlign: "left" }}>
                    {renderChatLog()}
                </List>
                <Divider />
                <Box sx={{ mt: "1em", display: "flex", direction: "row", flex: 1 }}>
                    <TextField fullWidth sx={{ mr: "1em", flex: 9 }}
                        value={messageText} onChange={e => setMessageText(e.target.value)}
                    />
                    <Button fullWidth variant="contained" sx={{ flex: 1 }}
                        onClick={() => {
                            if (!messageText) return;
                            props.sendMessage(messageText)
                            setMessageText('');
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            </CardContent>
        </Paper>
    );
};

export default Chat;