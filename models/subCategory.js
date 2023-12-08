const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const subCategoryImagePath = "/uploads/subCategorytImages";

const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subCategoryImage: {
        type: String,
        required: true,
    },
    description: {
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
        cb(null, path.join(__dirname, "..", subCategoryImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

subCategorySchema.statics.subCategoryUploadImage = multer({
    storage: imageStorage,
}).single("subCategoryImage");

subCategorySchema.statics.imageModelPath = subCategoryImagePath;

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
