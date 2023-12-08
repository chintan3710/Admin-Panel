const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const sliderImagePath = "/uploads/sliderImages";

const sliderSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sliderImage: {
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
        cb(null, path.join(__dirname, "..", sliderImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

sliderSchema.statics.sliderUploadImage = multer({
    storage: imageStorage,
}).single("sliderImage");

sliderSchema.statics.imageModelPath = sliderImagePath;

const Slider = mongoose.model("Slider", sliderSchema);

module.exports = Slider;
