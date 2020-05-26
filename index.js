const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const ses = require("./utils/ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const conf = require("./config");
////socket.io code////
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080" || "https://burstyourbubble.herokuapp.com/",
}); ///if deploying alter this with url of website

//////////FILE UPLOAD///////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
/////////////////////////////////////
app.use(compression());
/////COOKIE SESSION WITH SOCKET////////
const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    secret: "alohomora sezame",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
////////////////////////////////////
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (!req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.post("/register", (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.pass;

    hash(password)
        .then((hashedPw) => {
            db.insertUser(first, last, email, hashedPw)
                .then((result) => {
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    res.json({
                        success: false,
                    });
                    console.log("error in password catch: ", err);
                });
        })
        .catch((err) => {
            console.log("error in Post register in hash", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    db.getPass(req.body.email)
        .then((result) => {
            const hashedPw = result.rows[0].password;
            const password = req.body.pass;
            const id = result.rows[0].id;
            compare(password, hashedPw)
                .then((matchValue) => {
                    if (matchValue == true) {
                        req.session.userId = id;
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.log("error in POST login compare", error);
                    res.json({
                        success: false,
                    });
                });
        })
        .catch((error) => {
            console.log("error in post login: ", error);
            res.json({
                success: false,
            });
        });
});

app.post("/password/reset/start", (req, res) => {
    db.checkEmail(req.body.email)
        .then((result) => {
            if (result.rows[0].exists == true) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                let email = req.body.email;
                db.insertCode(secretCode, email)
                    .then(() => {
                        ses.sendEmail(
                            email,
                            "Bubbles Verification Code",
                            secretCode
                        )
                            .then(() => {
                                res.json({
                                    success: true,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.json({
                                    success: false,
                                });
                            });
                    })
                    .catch((error) => {
                        console.log("error in insertCode: ", error);
                        res.json({
                            success: false,
                        });
                    });
            } else {
                res.json({
                    success: false,
                });
            }
        })
        .catch((error) => {
            console.log("error in db.check email: ", error);
            res.json({
                state: false,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    db.findCode(req.body.email)
        .then((result) => {
            let index = result.rows.length - 1;
            if (result.rows[index].code == req.body.code) {
                hash(req.body.password)
                    .then((hashedPw) => {
                        db.updateUser(req.body.email, hashedPw)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("error in password catch: ", err);
                                res.json({
                                    success: false,
                                });
                            });
                    })
                    .catch((err) => {
                        console.log("error in Post register in hash", err);
                        res.json({ success: false });
                    });
            } else {
                res.json({
                    success: false,
                });
            }
        })
        .catch((error) => {
            console.log("error in find code: ", error);
            res.json({
                success: false,
            });
        });
});

app.get("/user", (req, res) => {
    const id = req.session.userId;
    db.getUserInfo(id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in getUserInfo: ", error);
        });
});

app.get("/user/:id.json", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({
            redirect: true,
        });
    } else {
        db.getUserInfo(req.params.id)
            .then((result) => {
                if (result.rows[0]) {
                    res.json(result.rows);
                } else {
                    res.json({
                        redirect: true,
                    });
                }
            })
            .catch((error) => {
                console.log("error in get user info id json: ", error);
            });
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let userId = req.session.userId;
    let imageUrl = conf.s3Url + req.file.filename;

    db.addProfPic(imageUrl, userId)
        .then(() => {
            res.json({
                success: true,
                imgUrl: imageUrl,
            });
        })
        .catch((error) => {
            console.log("error in insert prof pic: ", error);
            res.json({
                error: true,
            });
        });
});

app.post("/bio", (req, res) => {
    let userId = req.session.userId;
    let newBio = req.body.newBio;
    db.addBio(newBio, userId)
        .then(() => {
            res.json({
                success: true,
                newBio,
            });
        })
        .catch((error) => {
            console.log("error in post bio: ", error);
        });
});

app.get("/findusers", (req, res) => {
    if (req.query.val == "") {
        db.getLastUsers(req.session.userId)
            .then((result) => {
                res.json(result.rows);
            })
            .catch((error) => {
                console.log("error in get users: ", error);
            });
    } else {
        db.getMatchingUsers(req.query.val, req.session.userId)
            .then((result) => {
                res.json(result.rows);
            })
            .catch((error) =>
                console.log("error in get matching users: ", error)
            );
    }
});

app.get("/initial-friendship-status/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;

    db.getInitialStatus(userId, otherId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) =>
            console.log("error in select initial status: ", error)
        );
});

app.post("/make-friend-request/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;

    db.makeFriendRequest(userId, otherId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in make friend request: ", error);
        });
});

app.post("/end-friendship/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;
    db.deleteFriendship(userId, otherId)
        .then(() => {
            res.json(otherId);
        })
        .catch((error) => {
            console.log("error in cancel end friendship: ", error);
        });
});

app.post("/add-friendship/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;
    db.addFriendship(userId, otherId)
        .then(() => {
            res.json(otherId);
        })
        .catch((error) => {
            console.log("error in add friendship: ", error);
        });
});

app.get("/friends-wannabes", (req, res) => {
    let id = req.session.userId;
    db.getFriendsWannabes(id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in friends-wannabes: ", error);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ logout: true });
});

app.get("*", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

server.listen(process.env.PORT || 8080, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};
io.on("connection", function (socket) {
    console.log(`socket with the ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    db.getLastTenMsgs()
        .then((result) => {
            io.sockets.emit("chatMessages", result.rows);
        })
        .catch((error) => {
            console.log("error in gettenlastmsgs: ", error);
        });

    socket.on("newChatMsg", (newMsg) => {
        db.insertNewMsg(newMsg, userId)
            .then(() => {
                db.getMessenger(userId)
                    .then((response) => {
                        io.sockets.emit("chatMessage", response.rows);
                    })
                    .catch((error) =>
                        console.log("error in getMessenger: ", error)
                    );
            })
            .catch((error) => {
                console.log("error in insertnewMsg: ", error);
            });
    });

    onlineUsers[socket.id] = userId;

    let userCount = 0;
    for (const socket in onlineUsers) {
        if (onlineUsers[socket] == userId) {
            userCount++;
        }
    }

    if (userCount > 1) {
        return;
    } else {
        db.getUserInfo(userId)
            .then((response) => {
                io.sockets.sockets[socket.id].broadcast.emit(
                    "userjoined",
                    response.rows
                );
            })
            .catch((error) => {
                console.log("error in userjoined: ", error);
            });
    }

    let onlineUserIds = [];

    for (const socket in onlineUsers) {
        onlineUserIds.push(onlineUsers[socket]);
    }

    db.getOnlineUsers(onlineUserIds)
        .then((response) => {
            io.sockets.sockets[socket.id].emit("onlineusers", response.rows);
        })
        .catch((error) => {
            console.log("error in get online users: ", error);
        });

    socket.on("disconnect", () => {
        console.log(`socket with the ${socket.id} is now disconnected`);

        delete onlineUsers[socket.id];

        let userCheck = 0;
        for (const socket in onlineUsers) {
            if (onlineUsers[socket] == userId) {
                userCheck++;
            }
        }

        if (userCheck > 0) {
            return;
        } else {
            io.sockets.emit("userleft", userId);
        }
    });

    socket.on("getPrivateMessages", () => {
        db.getPrivateMsgs(userId)
            .then((result) => {
                io.to(socket.id).emit("privateMessages", result.rows);
            })
            .catch((error) => {
                console.log("error in getPrivateMsgs: ", error);
            });
    });

    socket.on("newPrivateChatMsg", (privateMsg) => {
        db.insertNewPrivateMsg(privateMsg.newMsg, userId, privateMsg.receiver)
            .then((result) => {
                db.getPrivateMessage(result.rows[0].id)
                    .then((response) => {
                        for (const socket in onlineUsers) {
                            if (
                                onlineUsers[socket] == userId ||
                                onlineUsers[socket] == privateMsg.receiver
                            )
                                io.to(socket).emit(
                                    "newPrivateChatMessage",
                                    response.rows
                                );
                        }
                    })
                    .catch((error) =>
                        console.log("error in getPrivateMessage: ", error)
                    );
            })
            .catch((error) => {
                console.log("error in insertnewMsg: ", error);
            });
    });
});
