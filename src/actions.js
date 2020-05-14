import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios
        .get("/friends-wannabes")
        .then(({ data }) => {
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
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}

export function chatMessages(msgs) {
    return {
        type: "GET_LAST_TEN_MSGS",
        msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "NEW_CHAT_MESSAGE",
        msg,
    };
}

export function userJoined(user) {
    return {
        type: "USER_JOINED",
        user,
    };
}

export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users,
    };
}

export function userLeft(user) {
    return {
        type: "USER_LEFT",
        user,
    };
}

export function privateMessages(privateMsgs) {
    return {
        type: "PRIVATE_MESSAGES",
        privateMsgs,
    };
}

export function privateMessage(privateMsg) {
    return {
        type: "PRIVATE_MESSAGE",
        privateMsg,
    };
}
