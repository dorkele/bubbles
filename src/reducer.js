export default function reducer(state = {}, action) {
    ///reducer is a series of conditionals
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    if (action.type === "UNFRIEND") {
        console.log("state.friendsWannabes: ", state.friendsWannabes);
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friend) => friend.id !== action.id
            ),
        };
    }
    return state;
}
