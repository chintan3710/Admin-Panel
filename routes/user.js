const express = require("express");

const Comment = require("../models/comment");

const userController = require("../controllers/userController");

const routes = express.Router();

routes.get("/", userController.home);

routes.get("/single_post/:id", userController.single_post);

routes.post(
    "/addcomment",
    Comment.commentUploadImage,
    userController.addcomment
);

routes.get("/threeCol", userController.threeCol);

routes.get("/contact", userController.contact);

routes.post("/insertContactData", userController.insertContactData);

module.exports = routes;
