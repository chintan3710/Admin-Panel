const express = require("express");

const RecentPhoto = require("../models/recentPhoto");

const recentPhotoController = require("../controllers/recentPhotoController");

const routes = express.Router();

routes.get("/add_recentPhoto", recentPhotoController.add_recentPhoto);

routes.post(
    "/insertRecentPhotoData",
    RecentPhoto.recentPhotoUploadImage,
    recentPhotoController.insertRecentPhotoData
);

routes.get("/view_recentPhoto", recentPhotoController.view_recentPhoto);

routes.get("/activeRecentPhoto/:id", recentPhotoController.activeRecentPhoto);

routes.get(
    "/deActiveRecentPhoto/:id",
    recentPhotoController.deActiveRecentPhoto
);

routes.get("/deleteRecentPhoto/:id", recentPhotoController.deleteRecentPhoto);

routes.get("/updateRecentPhoto/:id", recentPhotoController.updateRecentPhoto);

routes.post(
    "/editRecentPhoto",
    RecentPhoto.recentPhotoUploadImage,
    recentPhotoController.editRecentPhoto
);

module.exports = routes;
