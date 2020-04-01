const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");

app.use(compression());
app.use(
    require("cookie-session")({
        secret: "alohomora sezame",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(express.static("public"));
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
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
        .then(hashedPw => {
            console.log("hashedPW", hashedPw);

            db.insertUser(first, last, email, hashedPw)
                .then(result => {
                    console.log(result.rows);

                    req.session.userId = result.rows[0].id;
                    console.log(req.session);

                    res.json({ success: true });
                })
                .catch(err => {
                    res.json({
                        success: false
                    });
                    console.log("error in password catch: ", err);
                });
        })
        .catch(err => {
            console.log("error in Post register in hash", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    console.log("/POST LOGIN");
    console.log("req.body: ", req.body);
    db.getPass(req.body.email)
        .then(result => {
            const hashedPw = result.rows[0].password;
            const password = req.body.pass;
            const id = result.rows[0].id;
            console.log(hashedPw, password);

            compare(password, hashedPw)
                .then(matchValue => {
                    if (matchValue == true) {
                        console.log("result.rows[0].id: ", result.rows[0].id);
                        req.session.userId = id;
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(error => {
                    console.log("error in POST login compare", error);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(error => {
            console.log("error in post login: ", error);
            res.json({
                success: false
            });
        });
});

app.get("*", (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
