import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);
    console.log("last 10msgs: ", chatMessages);

    useEffect(() => {
        // console.log("chat hooks has mounted!");
        // console.log("elemRef: ", elemRef);
        // console.log("scrollTop: ", elemRef.current.scrollTop);
        // console.log("scrollHeight: ", elemRef.current.scrollHeight);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        ///everytime we get a new msg we need to check it
    }, []);

    const keyCheck = (e) => {
        // console.log("value: ", e.target.value);
        // console.log("key pressed: ", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            //console.log("Our msg: ", e.target.value);
            socket.emit("newChatMsg", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <p>Welcome to chat</p>

            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((msgs) => {
                        return (
                            <div key={msgs.id}>
                                <img height="30px" src={msgs.img_url} />
                                <p>
                                    {msgs.first} {msgs.last}
                                </p>
                                <p>{msgs.text}</p>
                                <p>{msgs.created_at}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
