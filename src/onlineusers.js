import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function OnlineUsers() {
    //let onlineUsers = [];
    let onlineUsers = useSelector((state) => {
        console.log("state: ", state);
        return state && state.users;
    });

    useEffect(() => {}, [onlineUsers]);
    console.log("onlineUsers in onlineusers: ", onlineUsers);

    return (
        <div className="online-users">
            <div>See who is currently online:</div>
            {onlineUsers &&
                onlineUsers.map((user) => {
                    return (
                        <div key={user.id}>
                            <img
                                height="30px"
                                src={user.img_url}
                                onError={(e) => {
                                    e.target.src =
                                        "/images/bubbles-prof-default.png";
                                }}
                            />
                            />
                            <p>
                                {user.first} {user.last}
                            </p>
                        </div>
                    );
                })}
        </div>
    );
}
