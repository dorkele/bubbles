import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function OnlineUsers() {
    //let onlineUsers = [];
    let onlineUsers = useSelector((state) => {
        console.log("state: ", state);
        return state.users;
        //&&
        //     state.friendsWannabes.filter((friend) => friend.accepted === true)
        // );
    });

    useEffect(() => {}, [onlineUsers]);

    return (
        <React.Fragment>
            <div>See who is currently online:</div>
            {onlineUsers &&
                onlineUsers.map((user) => {
                    return (
                        <div key={user.id}>
                            <img height="30px" src={user.img_url} />
                            <p>
                                {user.first} {user.last}
                            </p>
                        </div>
                    );
                })}
        </React.Fragment>
    );
}
