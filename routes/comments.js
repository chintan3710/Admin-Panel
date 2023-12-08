const express = require("express");

const routes = express.Router();

const commentsController = require("../controllers/commentsController");

routes.get("/view_comments", commentsController.view_comments);

routes.get("/activeComment/:id", commentsController.activeComment);

routes.get("/deactiveComment/:id", commentsController.deactiveComment);

module.exports = routes;
