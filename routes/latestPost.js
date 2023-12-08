const express = require("express");

const LatestPost = require("../models/latestPost");

const routes = express.Router();

let latestPostController = require("../controllers/latestPostController");

routes.get("/add_latest_post", latestPostController.add_latest_post);

routes.post(
    "/insertLatestPostData",
    LatestPost.latestPostUploadImage,
    latestPostController.insertLatestPostData
);

routes.get("/view_latest_post", latestPostController.view_latest_post);

routes.get("/activeLatestPost/:id", latestPostController.activeLatestPost);

routes.get("/deActiveLatestPost/:id", latestPostController.deActiveLatestPost);

routes.get("/deActiveLatestPost/:id", latestPostController.deActiveLatestPost);

routes.get("/deleteLatestPost/:id", latestPostController.deleteLatestPost);

routes.get("/updateLatestPost/:id", latestPostController.updateLatestPost);

routes.post(
    "/editLatestPostData",
    LatestPost.latestPostUploadImage,
    latestPostController.editLatestPostData
);

routes.use("/comments", require("./comments"));

module.exports = routes;
