//// file full of functions that return objects - action creator is
// the function which returns the object which is action

import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios
        .get("/friends-wannabes")
        .then(({ data }) => {
            console.log("data from get friends-wannabes in actions: ", data);
            return {
                type: "RECEIVE_FRIENDS_WANNABES",
                friendsWannabes: data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}

export function unfriend(id) {
    return axios
        .post(`/end-friendship/${id}`)
        .then((response) => {
            console.log("data from end friendship in actions: ", response.data);
            return {
                type: "UNFRIEND",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in unfriend: ", error);
        });
}

export function acceptFriend(id) {
    return axios
        .post(`/add-friendship/${id}`)
        .then((response) => {
            console.log("data from add friend in actions: ", response.data);
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}
