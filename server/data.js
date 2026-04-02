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

const editLastMessage = (roomName, userName, text) => {
    return Room.get(roomName).editLastMessage(userName, text);
}

const deleteLastMessage = (roomName, userName) => {
    return Room.get(roomName).deleteLastMessage(userName);
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

    editLastMessage(userName, text) {
        const trimmedText = text?.trim();

        if (!trimmedText) {
            return false;
        }

        for (let index = this.#log.length - 1; index >= 0; index -= 1) {
            const message = this.#log[index];

            if (message.sender !== userName)
                continue;

            if (message.deletedAt)
                return false;

            message.text = trimmedText;
            message.editedAt = Date.now();
            return true;
        }

        return false;
    }

    deleteLastMessage(userName) {
        for (let index = this.#log.length - 1; index >= 0; index -= 1) {
            const message = this.#log[index];

            if (message.sender !== userName)
                continue;

            if (message.deletedAt)
                return false;

            message.deletedAt = Date.now();
            return true;
        }

        return false;
    }
}


export {
    registerUser,
    unregisterUser,
    isUserNameTaken,
    isUserNameAvailable,
    roomLog,
    addMessage,
    editLastMessage,
    deleteLastMessage,
    updateTypingStatus,
    getTypingUsers
}