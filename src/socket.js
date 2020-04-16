////middleman between server and redux
////dispatching actions
import * as io from "socket.io-client";
import { chatMessages, chatMessage } from "./actions";
///usedispatch in socket
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // socket.on("chat", (newMsg) => {
        //     console.log(
        //         "I got a new chat Msg in the front end, dispatching here, ",
        //         newMsg
        //     );
        // });

        socket.on("chatMessages", (msgs) => {
            //console.log("msgs in socket.js: ", msgs);
            store.dispatch(chatMessages(msgs));
        });

        // socket.on(
        //     'chatMessage',
        //     msg => store.dispatch(
        //         chatMessage(msg)
        //     )
        // );
    }
};
