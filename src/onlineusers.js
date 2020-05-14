import React from "react";
import { useSelector } from "react-redux";

export default function OnlineUsers() {
    let onlineUsers = useSelector((state) => {
        return state && state.users;
    });

    return (
        <div>
            <div className="black-font">Currently online:</div>
            {onlineUsers &&
                onlineUsers.map((user) => {
                    return (
                        <div key={user.id} className="online-user">
                            <div className="prof-pic prof-pic-online">
                                <img
                                    className="tiny-pic"
                                    src={user.img_url}
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/bubbles-prof-default.png";
                                    }}
                                />
                            </div>
                            <p>
                                {user.first} {user.last}
                            </p>
                        </div>
                    );
                })}
        </div>
    );
}
