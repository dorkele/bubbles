//// file full of functions that return objects - action creator is
// the function which returns the object which is action

import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios.get("/friends-wannabes").then(({ data }) => {
        console.log("data from get friends-wannabes in actions: ", data);
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data,
        };
    });
}
