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
        <div className="chat-online">
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((msgs) => {
                        return (
                            <div key={msgs.id}>
                                <img
                                    height="30px"
                                    src={msgs.img_url}
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/bubbles-prof-default.png";
                                    }}
                                />
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

                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
            <OnlineUsers />
        </div>
    );
}
