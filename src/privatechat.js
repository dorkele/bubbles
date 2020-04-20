import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function PrivateChat() {
    const elemRef = useRef();
    const privateChatMessages = useSelector(
        (state) => state && state.privateMsgs
    );

    console.log("sto je stiglo do nas u private chate: ", privateChatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateChatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            let receiver = window.location.pathname.split("/").pop();
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
        <div className="chat-online">
            <div className="chat-messages-container style-2" ref={elemRef}>
                {privateChatMessages &&
                    privateChatMessages.map((msgs) => {
                        return (
                            <div key={msgs.id} className="comment-container">
                                <img
                                    height="30px"
                                    src={msgs.img_url}
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/bubbles-prof-default.png";
                                    }}
                                />
                                <div className="comment-text speech-bubble">
                                    <p>
                                        {" "}
                                        {msgs.first} {msgs.last}{" "}
                                    </p>
                                    <p className="white-font"> {msgs.text} </p>
                                    <p>
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
    );
}
