import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import OnlineUsers from "./onlineusers";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);

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
            <OnlineUsers />
            <div className="chat-textarea">
                <div className="chat-messages-container style-2" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((msgs) => {
                            return (
                                <div
                                    key={msgs.id}
                                    className="comment-container"
                                >
                                    <div className="tiny-pic">
                                        <img
                                            className="prof-pic"
                                            height="30px"
                                            src={msgs.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/images/bubbles-prof-default.png";
                                            }}
                                        />
                                    </div>
                                    <div className="comment-text">
                                        <p className="black-font name-date">
                                            {msgs.first} {msgs.last}
                                        </p>
                                        <div className="speech-bubble">
                                            <p className="white-font">
                                                {msgs.text}
                                            </p>
                                        </div>
                                        <p className="black-font name-date">
                                            {new Date(
                                                msgs.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea
                    className="write-comment"
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}
