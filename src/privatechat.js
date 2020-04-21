import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import OnlineUsers from "./onlineusers";

export default function PrivateChat() {
    const elemRef = useRef();
    let receiver = window.location.pathname.split("/").pop();
    console.log("receiver: ", receiver);

    const privateChatMessages = useSelector(
        (state) =>
            state &&
            state.privateMsgs &&
            state.privateMsgs.filter((privateMsg) => {
                if (
                    privateMsg.receiver_id == receiver ||
                    privateMsg.sender_id == receiver
                ) {
                    return privateMsg;
                }
            })
    );

    console.log("sto je stiglo do nas u private chate: ", privateChatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        socket.emit("getPrivateMessages");
    }, [privateChatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            //console.log("window.location.pathname: ", window.location.pathname);
            let newMessage = {
                receiver: receiver,
                newMsg: e.target.value,
            };
            console.log("receiver: ", newMessage);
            e.preventDefault();
            socket.emit("newPrivateChatMsg", newMessage);
            e.target.value = "";
        }
    };

    return (
        <div className="chat-online-private">
            <OnlineUsers className="online-users-container" />
            <div className="chat-textarea-private">
                <div className="chat-messages-container style-2" ref={elemRef}>
                    {privateChatMessages &&
                        privateChatMessages.map((msgs) => {
                            return (
                                <div
                                    key={msgs.id}
                                    className="comment-container"
                                >
                                    <div className="tiny-pic">
                                        <img
                                            className="prof-pic"
                                            src={msgs.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/images/bubbles-prof-default.png";
                                            }}
                                        />
                                    </div>
                                    <div className="comment-text">
                                        <p className="black-font name-date">
                                            {" "}
                                            {msgs.first} {msgs.last}{" "}
                                        </p>
                                        <div className="speech-bubble">
                                            <p className="white-font">
                                                {" "}
                                                {msgs.text}{" "}
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
