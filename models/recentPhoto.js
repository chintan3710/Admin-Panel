const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const recentPhotoImagePath = "/uploads/recentPhotoImages";

const recentPhotoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    recentPhotoImage: {
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
        cb(null, path.join(__dirname, "..", recentPhotoImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

recentPhotoSchema.statics.recentPhotoUploadImage = multer({
    storage: imageStorage,
}).single("recentPhotoImage");

recentPhotoSchema.statics.imageModelPath = recentPhotoImagePath;

const RecentPhoto = mongoose.model("RecentPhoto", recentPhotoSchema);

module.exports = RecentPhoto;
