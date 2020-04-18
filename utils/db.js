const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.insertUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.getPass = (email) => {
    const q = `SELECT id, password FROM users
    WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.checkEmail = (email) => {
    const q = `SELECT EXISTS(
        SELECT 1 FROM users WHERE users.email=$1
    )`;
    const params = [email];
    return db.query(q, params);
};

module.exports.insertCode = (code, email) => {
    const q = `INSERT INTO pw_reset_codes (code, email)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.findCode = (email) => {
    const q = `SELECT * FROM pw_reset_codes
    WHERE email=$1
    AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updateUser = (email, hashedPw) => {
    const q = `UPDATE users
    SET password=$2
    WHERE email=$1`;
    const params = [email, hashedPw];
    return db.query(q, params);
};

module.exports.getUserInfo = (id) => {
    const q = `SELECT * FROM users
    WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addProfPic = (imgUrl, id) => {
    const q = `UPDATE users
    SET img_url=$1
    WHERE id=$2`;
    const params = [imgUrl, id];
    return db.query(q, params);
};

module.exports.addBio = (newBio, id) => {
    const q = `UPDATE users
    SET bio=$1
    WHERE id=$2`;
    const params = [newBio, id];
    return db.query(q, params);
};

module.exports.getLastUsers = () => {
    const q = `SELECT * FROM users
     ORDER BY created_at DESC 
     LIMIT 3;`;
    return db.query(q);
};

module.exports.getMatchingUsers = (val) => {
    const q = `SELECT * FROM users 
    WHERE first ILIKE $1`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.getInitialStatus = (userId, otherId) => {
    const q = `SELECT * FROM friendships 
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.makeFriendRequest = (userId, otherId) => {
    const q = `INSERT INTO friendships (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.deleteFriendship = (userId, otherId) => {
    const q = `DELETE FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.addFriendship = (userId, otherId) => {
    const q = `UPDATE friendships
    SET accepted=true
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.getFriendsWannabes = (id) => {
    const q = `SELECT users.id, first, last, img_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getLastTenMsgs = () => {
    const q = `SELECT * FROM (SELECT chat.id, first, last, img_url, text, chat.created_at
    FROM users
    JOIN chat
    ON user_id = users.id
    ORDER BY created_at DESC
    LIMIT 10) as last_chat
    ORDER BY created_at ASC;
    `;
    return db.query(q);
};

module.exports.insertNewMsg = (newMsg, userId) => {
    const q = `INSERT INTO chat (text, user_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [newMsg, userId];
    return db.query(q, params);
};

module.exports.getMessenger = (userId) => {
    const q = `SELECT chat.id, first, last, img_url, text, chat.created_at
    FROM users
    JOIN CHAT 
    ON user_id = $1
    WHERE users.id = $1
    ORDER BY created_at DESC
    LIMIT 1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getOnlineUsers = (onlineUserIds) => {
    const q = `SELECT id, first, last, img_url
    FROM users 
    WHERE id = ANY($1);`;
    const params = [onlineUserIds];
    return db.query(q, params);
};
