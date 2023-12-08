const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/admin-db");

const db = mongoose.connection;

db.once("open", (err) => {
    err
        ? console.log("DB not connected")
        : console.log("DB connected successfully");
});

module.exports = db;
    