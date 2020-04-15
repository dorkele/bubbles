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

    return (
        <React.Fragment>
            <div>
                <p>People who want to explore your bubble:</p>
                <div>
                    {wannabes &&
                        wannabes.map((wannabe) => {
                            return (
                                <div key={wannabe.id}>
                                    <Link to={"/user/" + wannabe.id}>
                                        <img src={wannabe.img_url} />
                                        <p>
                                            {wannabe.first} {wannabe.last}
                                        </p>
                                    </Link>
                                    <button
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
                <p>People whose bubbles you can explore:</p>
                <div>
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <Link to={"/user/" + friend.id}>
                                        <img src={friend.img_url} />
                                        <p>
                                            {friend.first} {friend.last}
                                        </p>
                                    </Link>
                                    <button
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
