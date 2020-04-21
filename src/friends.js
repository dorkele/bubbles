import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, unfriend, acceptFriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();

    let friends = useSelector((state) => {
        //console.log("state.friendsWannabes: ", state.friendsWannabes);
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted === true)
        );
    });

    let wannabes = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter(
                (wannabe) => wannabe.accepted === false
            )
        );
    });

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
        console.log("dispatching receivefriendswannabes");
    }, []);

    console.log("wannabes: ", wannabes);
    return (
        <React.Fragment>
            <div>
                {wannabes && wannabes.length > 0 && (
                    <p className="black-font title">
                        People who want to be your friends ({wannabes.length}):
                    </p>
                )}
                <div className="grid-container friends-big-container">
                    {wannabes &&
                        wannabes.map((wannabe) => {
                            return (
                                <div
                                    key={wannabe.id}
                                    className="friends-wannabes-container"
                                >
                                    <div className="prof-pic center">
                                        <img
                                            className="big-pic"
                                            src={wannabe.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/images/bubbles-prof-default.png";
                                            }}
                                        />
                                    </div>
                                    <Link
                                        to={"/user/" + wannabe.id}
                                        className="center"
                                    >
                                        {wannabe.first} {wannabe.last}
                                    </Link>
                                    <button
                                        className="friends-btn"
                                        onClick={() => {
                                            dispatch(acceptFriend(wannabe.id));
                                        }}
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div>
                {friends && friends.length > 0 && (
                    <p className="black-font title">
                        Friends ({friends.length}):
                    </p>
                )}
                <div className="grid-container friends-big-container">
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div
                                    key={friend.id}
                                    className="friends-wannabes-container"
                                >
                                    <div className="prof-pic center">
                                        <img
                                            className="big-pic"
                                            src={friend.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/images/bubbles-prof-default.png";
                                            }}
                                        />
                                    </div>
                                    <Link
                                        to={"/user/" + friend.id}
                                        className="center"
                                    >
                                        {friend.first} {friend.last}
                                    </Link>
                                    <button
                                        className="friends-btn"
                                        onClick={() =>
                                            dispatch(unfriend(friend.id))
                                        }
                                    >
                                        End Friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </React.Fragment>
    );
}
