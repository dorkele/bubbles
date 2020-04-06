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
////////////////////////////////////////
app.use(compression());
app.use(
    require("cookie-session")({
        secret: "alohomora sezame",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
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
    console.log("req.data: ", req.body);
    console.log("post/register happening");

    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.pass;

    hash(password)
        .then((hashedPw) => {
            console.log("hashedPW", hashedPw);

            db.insertUser(first, last, email, hashedPw)
                .then((result) => {
                    console.log(result.rows);

                    req.session.userId = result.rows[0].id;
                    console.log(req.session);

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
    console.log("/POST LOGIN");
    console.log("req.body: ", req.body);
    db.getPass(req.body.email)
        .then((result) => {
            const hashedPw = result.rows[0].password;
            const password = req.body.pass;
            const id = result.rows[0].id;
            console.log(hashedPw, password);

            compare(password, hashedPw)
                .then((matchValue) => {
                    if (matchValue == true) {
                        console.log("result.rows[0].id: ", result.rows[0].id);
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
    console.log("i am now in POST /password/reset/start route");
    console.log("req.body: ", req.body);
    db.checkEmail(req.body.email)
        .then((result) => {
            console.log("result in check Email: ", result.rows[0].exists);
            if (result.rows[0].exists == true) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                let email = req.body.email;
                db.insertCode(secretCode, email)
                    .then((response) => {
                        console.log(response);

                        ses.sendEmail(
                            email,
                            "Bubbles Verification Code",
                            secretCode
                        )
                            .then(() => {
                                console.log("working!");
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
    console.log("i arrived in POST /password/reset/verify");
    console.log("req.body.email&code: ", req.body.email, req.body.code);
    db.findCode(req.body.email)
        .then((result) => {
            console.log(result.rows);
            let index = result.rows.length - 1;

            if (result.rows[index].code == req.body.code) {
                console.log("req.body.newPw: ", req.body.password);

                hash(req.body.password)
                    .then((hashedPw) => {
                        console.log("hashedPW", hashedPw);
                        db.updateUser(req.body.email, hashedPw)
                            .then((result) => {
                                console.log(result.rows);
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
    console.log("i am in GET user route");
    console.log("req.session.userId: ", req.session.userId);
    const id = req.session.userId;
    db.getUserInfo(id)
        .then((result) => {
            console.log("result.rows in getUserInfo: ", result.rows);
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
    }
    db.getUserInfo(req.params.id).then(({ rows }) =>
        res.json(
            rows[0] || {
                redirect: true,
            }
        )
    );
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("i am in POST upload route");

    let userId = req.session.userId;
    let imageUrl = conf.s3Url + req.file.filename;
    console.log("imageUrl: ", imageUrl);

    db.addProfPic(imageUrl, userId)
        .then((response) => {
            console.log("response in insert prof pic: ", response);
            res.json({
                success: true,
                imgUrl: imageUrl,
            });
        })
        .catch((error) => {
            console.log("error in insert prof pic: ", error);
        });
});

app.post("/bio", (req, res) => {
    console.log("made it to POST bio");
    console.log("req.body u post bio: ", req.body);
    let userId = req.session.userId;
    let newBio = req.body.newBio;
    db.addBio(newBio, userId)
        .then((response) => {
            console.log("response in post bio: ", response);
            res.json({
                success: true,
                newBio,
            });
        })
        .catch((error) => {
            console.log("error in post bio: ", error);
        });
});

app.get("*", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
