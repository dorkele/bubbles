//// file full of functions that return objects - action creator is
// the function which returns the object which is action

import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios
        .get("/friends-wannabes")
        .then(({ data }) => {
            //console.log("data from get friends-wannabes in actions: ", data);
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
            //console.log("data from end friendship in actions: ", response.data);
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
            //console.log("data from add friend in actions: ", response.data);
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}

/////for chat msgs not axios only passing to reducer
export function chatMessages(msgs) {
    //console.log("I am in actionss showing what i have: ", msgs);
    return {
        type: "GET_LAST_TEN_MSGS",
        msgs,
    };
}

export function chatMessage(msg) {
    //console.log("I am in actionss showing that newmsg: ", msg);
    return {
        type: "NEW_CHAT_MESSAGE",
        msg,
    };
}

export function userJoined(user) {
    console.log("I am in actions showing the user that joined: ", user);
    return {
        type: "USER_JOINED",
        user,
    };
}

export function onlineUsers(users) {
    console.log("I am in actions showing online users: ", users);
    return {
        type: "ONLINE_USERS",
        users,
    };
}
