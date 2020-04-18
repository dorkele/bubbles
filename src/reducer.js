export default function reducer(state = {}, action) {
    ///reducer is a series of conditionals
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
        //console.log("action.msgs: ", action.msgs);
        state = {
            ...state,
            msgs: action.msgs,
        };
    }

    if (action.type === "NEW_CHAT_MESSAGE") {
        //console.log("action.msg: ", action.msg);
        state = {
            ...state,
            msgs: state.msgs.concat(action.msg),
        };
    }

    if (action.type === "USER_JOINED") {
        //console.log("state in reducer: ", state);
        state = {
            ...state,
            users: state.users.concat(action.user),
        };
    }

    if (action.type === "ONLINE_USERS") {
        //console.log("state in resudecr online users: ", state);
        state = {
            ...state,
            users: action.users,
        };
    }

    return state;
}
