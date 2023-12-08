const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const latestPostImagePath = "/uploads/latestPostImages";

const latestPostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    latestPostImage: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    currentDate: {
        type: String,
        required: true,
    },
    updateDate: {
        type: String,
        required: true,
    },
});

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", latestPostImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

latestPostSchema.statics.latestPostUploadImage = multer({
    storage: imageStorage,
}).single("latestPostImage");

latestPostSchema.statics.imageModelPath = latestPostImagePath;

const LatestPost = mongoose.model("LatestPost", latestPostSchema);

module.exports = LatestPost;
