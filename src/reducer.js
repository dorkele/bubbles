export default function reducer(state = {}, action) {
    ///reducer is a series of conditionals
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }
    return state;
}
