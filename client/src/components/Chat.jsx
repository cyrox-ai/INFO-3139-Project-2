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
    Stack,
    Drawer
} from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import * as fns from "date-fns";

const Chat = (props) => {
    /* Menu */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Chat Log */
    const lastMessageRef = useRef(null);

    const renderMessage = (message, index) => {
        /* New Day Messages */
        if (message.newDay) {
            return <div key={index} ref={lastMessageRef} style={{ marginBottom: "1em" }}>
                <Typography variant="h6" textAlign="center">
                    <strong>{message.text}</strong>
                </Typography>
            </div>;
        }

        if (message.sender === 'timestamp') {
            return <div key={index}>
                <Typography ref={lastMessageRef} variant="h6" style={{ textAlign: "center" }}>
                    {fns.format(new Date(message.timestamp), "HH:mm")}
                </Typography>
            </div>;
        }
        else if (message.sender === 'system') {
            return <div key={index}>
                <Typography ref={lastMessageRef} variant="h6" style={{ textAlign: "center" }}>
                    {message.text}
                </Typography>
            </div>;
        }
        else {
            const isCurrentUser = message.sender === props.userName;
            const messageClassName = isCurrentUser ? "user-message" : "message";

            return (
                <div key={index} ref={lastMessageRef} className={messageClassName}>
                    <div className="message-bubble" style={{ borderColor: message.color }}>
                        <Typography variant="h6" className="message-text" sx={{ color: message.color }}>
                            <strong>{message.sender}</strong>
                        </Typography>
                        <Typography variant="h6" className="message-text">
                            {message.text}
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: "right" }}>
                            <i>{fns.format(new Date(message.timestamp), "HH:mm")}</i>
                        </Typography>
                    </div>
                </div>
            );
        }
    }

    const renderChatLog = () => {
        const chat = props.chatLog ?? [];
        const chatWithNewDayMessages = [];

        let lastMessage = null;
        chat.forEach(message => {
            // Checking if there's no "previous message", start the chat with the Day Message
            // Or, if the day of the current message is different from the day of the previous message
            if (!lastMessage || fns.getDay(lastMessage.timestamp) != fns.getDay(message.timestamp)) {
                chatWithNewDayMessages.push({
                    // Not a user-sent message
                    sender: '',
                    // Formatting the text to the "Friday, April 29th, 1453" format
                    text: fns.format(message.timestamp, "PPPP"),
                    // A new property just being added here to *flag this as a special message*
                    newDay: true
                });
            }
            chatWithNewDayMessages.push(message);
            lastMessage = message;
        });
        return chatWithNewDayMessages.map(renderMessage);
    }

    const handleSendMessage = () => {
        if (!messageText) return;
        props.sendMessage(messageText);
        setMessageText('');
    }

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [props.chatLog]);

    /* Send Message */
    const [messageText, setMessageText] = useState("");

    const renderMenu = () => {

    }

    /* Render Component */
    return (
        <Paper elevation={4} sx={{ mt: "0.5em", display: "flex", flexDirection: "column" }}>
            {/* <CardHeader title={`${props.roomName} (as ${props.userName})`} /> */}
            <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
                {renderMenu()}
            </Drawer>
            <Stack direction="row" sx={{
                alignItems: "center", justifyContent: "space-between",
                pl: "1em", pr: "1em"
            }}>
                <Button variant="contained" onClick={() => setMenuOpen(true)} >
                    <MenuIcon />
                </Button>
                <CardHeader title={props.roomName} />
                <Button variant="contained">
                    <LogoutIcon />
                </Button>
            </Stack>
            <Divider />
            <Divider />
            <CardContent>
                <List sx={{ height: "60vh", overflowY: "scroll", textAlign: "left" }}>
                    {renderChatLog()}
                </List>
                <Divider />
                <Box sx={{ mt: "1em", display: "flex", direction: "row", flex: 1 }}>
                    <TextField fullWidth sx={{ mr: "1em", flex: 9 }}
                        value={messageText} onChange={e => setMessageText(e.target.value)}
                        onKeyDown={e => e.key == "Enter" && handleSendMessage()}
                    />
                    <Button fullWidth variant="contained" sx={{ flex: 1 }} onClick={handleSendMessage}>
                        <SendIcon />
                    </Button>
                </Box>
            </CardContent>
        </Paper>
    );
};

export default Chat;