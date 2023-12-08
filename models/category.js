const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
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

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
