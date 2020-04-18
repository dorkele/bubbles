import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import OnlineUsers from "./onlineusers";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);

    //console.log("last 10msgs: ", chatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
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
                                <p>
                                    {new Date(msgs.created_at).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
            <OnlineUsers />
        </div>
    );
}
