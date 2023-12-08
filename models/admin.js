const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const adminImagePath = "/uploads/adminImages";

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    hobby: {
        type: Array,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    adminImage: {
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
        cb(null, path.join(__dirname, "..", adminImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

adminSchema.statics.adminUploadImage = multer({ storage: imageStorage }).single(
    "adminImage"
);

adminSchema.statics.imageModelPath = adminImagePath;

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
