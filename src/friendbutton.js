import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

import axios from "./axios";
import PrivateChat from "./privatechat";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState();
    console.log("props in friendbutton: ", props);

    useEffect(() => {
        axios
            .get(`/initial-friendship-status/${props.id}`, {
                params: { id: props.id },
            })
            .then((response) => {
                console.log("response when comp mounts initial: ", response);

                if (response.data.length == 0) {
                    setButtonText("Send Friend Request");
                } else if (
                    response.data[0].accepted == false &&
                    response.data[0].sender_id == props.id
                ) {
                    setButtonText("Accept Friend Request");
                } else if (
                    response.data[0].accepted == false &&
                    response.data[0].sender_id != props.id
                ) {
                    setButtonText("Cancel Friend Request");
                } else if (response.data[0].accepted == true) {
                    setButtonText("End Friendship");
                }
            })
            .catch((error) =>
                console.log("error when comp mounts initial: ", error)
            );
    }, []);

    const handleClick = (e) => {
        console.log("buttonText: ", buttonText);
        e.preventDefault();
        if (buttonText == "Send Friend Request") {
            axios
                .post(`/make-friend-request/${props.id}`, {
                    params: { id: props.id },
                })
                .then((response) => {
                    console.log(
                        "response from make friend request: ",
                        response
                    );
                    if (response.data[0].accepted == false) {
                        setButtonText("Cancel Friend Request");
                    }
                })
                .catch((error) => {
                    console.log("error in make friend request: ", error);
                });
        } else if (
            buttonText == "Cancel Friend Request" ||
            buttonText == "End Friendship"
        ) {
            axios
                .post(`/end-friendship/${props.id}`, {
                    params: { id: props.id },
                })
                .then((response) => {
                    console.log(
                        "response in cancel end friendship: ",
                        response.data
                    );
                    setButtonText("Send Friend Request");
                })
                .catch((error) => {
                    console.log("error in cancel end friendship: ", error);
                });
        } else if (buttonText == "Accept Friend Request") {
            axios
                .post(`/add-friendship/${props.id}`, {
                    params: { id: props.id },
                })
                .then((response) => {
                    console.log("response in add friendship: ", response.data);
                    setButtonText("End Friendship");
                })
                .catch((error) => {
                    console.log("error in add friendship: ", error);
                });
        }
    };

    return (
        <div>
            <button onClick={handleClick} className="inside-btn">
                {buttonText}
            </button>
            {buttonText == "End Friendship" && <PrivateChat />}
        </div>
    );
}
