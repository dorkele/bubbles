export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter((friend) => {
                if (friend.id != action.id) {
                    return friend;
                }
            }),
        };
    }

    if (action.type === "GET_LAST_TEN_MSGS") {
        state = {
            ...state,
            msgs: action.msgs,
        };
    }

    if (action.type === "NEW_CHAT_MESSAGE") {
        state = {
            ...state,
            msgs: state.msgs.concat(action.msg),
        };
    }

    if (action.type === "USER_JOINED") {
        state = {
            ...state,
            users: state.users.concat(action.user),
        };
    }

    if (action.type === "ONLINE_USERS") {
        state = {
            ...state,
            users: action.users,
        };
    }

    if (action.type === "USER_LEFT") {
        state = {
            ...state,
            users: state.users.filter((user) => {
                if (user.id != action.user) {
                    return user;
                }
            }),
        };
    }

    if (action.type === "PRIVATE_MESSAGES") {
        let receiver = window.location.pathname.split("/").pop();
        state = {
            ...state,
            privateMsgs: action.privateMsgs.filter((privateMsg) => {
                if (
                    privateMsg.receiver_id == receiver ||
                    privateMsg.sender_id == receiver
                ) {
                    return privateMsg;
                }
            }),
        };
    }

    if (action.type === "PRIVATE_MESSAGE") {
        let receiver = window.location.pathname.split("/").pop();

        state = {
            ...state,
            privateMsgs: state.privateMsgs
                .concat(action.privateMsg)
                .filter((privateMsg) => {
                    if (
                        privateMsg.receiver_id == receiver ||
                        privateMsg.sender_id == receiver
                    ) {
                        return privateMsg;
                    }
                }),
        };
    }

    return state;
}
