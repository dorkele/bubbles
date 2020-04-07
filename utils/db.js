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

module.exports.getUsers = () => {
    const q = `SELECT * FROM users
     ORDER BY created_at DESC 
     LIMIT 3;`;
    return db.query(q);
};
