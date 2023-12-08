const express = require("express");

const path = require("path");

const Passport = require("passport");

const cookieParser = require("cookie-parser");

const session = require("express-session");

const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://chintanrajpara34:Chintan2.2@cluster0.6ki67zr.mongodb.net/admin-db",
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("Database connected."))
    .catch((err) => console.log(err));

const PassportLocal = require("./config/passport-local-strategy");

const port = 8002;

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(
    session({
        name: "RNW",
        secret: "RNW",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
    })
);

app.use(Passport.initialize());

app.use(Passport.session());

app.use(Passport.setAuth);

app.use(cookieParser());

app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "assets")));

app.use(express.static(path.join(__dirname, "userassets")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", require("./routes/user"));

app.use("/admin", require("./routes/admin"));

app.listen(port, (err) => {
    err
        ? console.log("Server not responding")
        : console.log(`Server respond successfully at port ${port}`);
});
