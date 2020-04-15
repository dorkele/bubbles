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

    return state;
}
