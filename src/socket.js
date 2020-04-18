////middleman between server and redux
////dispatching actions
import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    userJoined,
    onlineUsers,
    userLeft,
} from "./actions";
///usedispatch in socket
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            //console.log("msgs in socket.js: ", msgs);
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            //console.log("msg in socket.js: ", msg);
            store.dispatch(chatMessage(msg));
        });

        socket.on("userjoined", (user) => {
            //console.log("user joined in socket.js: ", user);

            store.dispatch(userJoined(user));
        });

        socket.on("onlineusers", (users) => {
            //console.log("online users in socket.js: ", users);
            store.dispatch(onlineUsers(users));
        });

        socket.on("userleft", (user) => {
            console.log("user left in socket.js: ", user);
            store.dispatch(userLeft(user));
        });
    }
};
