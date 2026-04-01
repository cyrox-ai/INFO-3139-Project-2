let users = new Set();

const registerUser = (userName) => {
    users.add(userName);
    console.log(`User registered: ${userName}`);
}

const unregisterUser = (userName) => {
    users.delete(userName);
    console.log(`User removed: ${userName}`);
}

const isUserNameTaken = (userName) => {
    return users.has(userName);
}

const isUserNameAvailable = (userName) => {
    return !isUserNameTaken(userName);
}

const roomLog = roomName => {
    return Room.get(roomName).log;
}

const addMessage = (roomName, messageInfo) => {
    Room.get(roomName).addMessage(messageInfo);
}

const updateTypingStatus = (roomName, userName, isTyping) => {
    Room.get(roomName).updateTypingStatus(userName, isTyping);
}

const getTypingUsers = (roomName) => {
    return Array.from(Room.get(roomName).typingUsers);
}

class Room {

    /* Static Interface */

    static #rooms = {};

    static get(roomName) {
        if (!Room.#rooms[roomName]) {
            Room.#rooms[roomName] = new Room(roomName);
        }
        return this.#rooms[roomName];
    }

    /* Instance Methods */

    #name = "";
    #log = [];
    #typingUsers = new Set();

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    get log() {
        return this.#log;
    }

    get typingUsers() {
        return this.#typingUsers;
    }

    updateTypingStatus(userName, isTyping) {
        if (isTyping) {
            this.#typingUsers.add(userName);
        }
        else {
            this.#typingUsers.delete(userName);
        }
    }

    addMessage(messageInfo) {
        messageInfo.timestamp = Date.now();
        this.#log.push(messageInfo);
    }
}


export {
    registerUser,
    unregisterUser,
    isUserNameTaken,
    isUserNameAvailable,
    roomLog,
    addMessage,
    updateTypingStatus,
    getTypingUsers
}