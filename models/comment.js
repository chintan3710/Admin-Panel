const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const commentImagePath = "/uploads/commentImages";

const commentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LatestPost",
        required: true,
    },
    userImage: {
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
        cb(null, path.join(__dirname, "..", commentImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

commentSchema.statics.commentUploadImage = multer({
    storage: imageStorage,
}).single("userImage");

commentSchema.statics.imageModelPath = commentImagePath;

const Comment = mongoose.model("Commet", commentSchema);

module.exports = Comment;
