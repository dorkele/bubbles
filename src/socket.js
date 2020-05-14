import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    userJoined,
    onlineUsers,
    userLeft,
    privateMessage,
    privateMessages,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            store.dispatch(chatMessage(msg));
        });

        socket.on("userjoined", (user) => {
            store.dispatch(userJoined(user));
        });

        socket.on("onlineusers", (users) => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userleft", (user) => {
            store.dispatch(userLeft(user));
        });

        socket.on("privateMessages", (msgs) => {
            store.dispatch(privateMessages(msgs));
        });

        socket.on("newPrivateChatMessage", (msg) => {
            store.dispatch(privateMessage(msg));
        });
    }
};
