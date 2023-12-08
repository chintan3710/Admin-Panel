const fs = require("fs");

const path = require("path");

const Category = require("../models/category");

const SubCategory = require("../models/subCategory");

module.exports.add_subCategory = async (req, res) => {
    try {
        let categoryData = await Category.find({});
        return res.render("add_subCategory", {
            categoryData: categoryData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertCategoryData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = SubCategory.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.subCategoryImage = imagePath;
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await SubCategory.create(req.body);
            return res.redirect("back");
        } else {
            console.log("Data NOt Found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Something Went Wrong", err);
        return res.redirect("back");
    }
};

module.exports.view_subCategory = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalSubCategoryData = await SubCategory.find({
            $or: [
                { category: { $regex: ".*" + search + ".*", $options: "i" } },
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await SubCategory.find({
            $or: [
                { category: { $regex: ".*" + search + ".*", $options: "i" } },
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        let subCategoryData = await SubCategory.find({})
            .populate("categoryId")
            .exec();
        return res.render("view_subCategory", {
            subCategoryData: subCategoryData,
            search: search,
            totalDocument: Math.ceil(totalSubCategoryData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeSubCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await SubCategory.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("SubCategory not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("SubCategory not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveSubCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await SubCategory.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("SubCategory not activate");
                return res.redirect("back");
            }
        } else {
            console.log("SubCategory not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteSubCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await SubCategory.findById(req.params.id);
            if (oldData) {
                if (oldData.subCategoryImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.subCategoryImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("SubCategory image not found");
                }
            } else {
                console.log("SubCategory not found");
            }
            let data = await SubCategory.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("SubCategory not delete");
            }
        } else {
            console.log("SubCategory not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
};

module.exports.updateSubCategory = async (req, res) => {
    try {
        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.findById(req.params.id)
            .populate("categoryId")
            .exec();
        console.log(subCategoryData);
        return res.render("update_subCategory", {
            categoryData: categoryData,
            subCategoryData: subCategoryData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editSubCategoryData = async (req, res) => {
    try {
        let oldData = await SubCategory.findById(req.body.oldId);
        if (req.file) {
            if (oldData.subCategoryImage) {
                let fullPath = path.join(
                    __dirname,
                    ".." + oldData.subCategoryImage
                );
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = SubCategory.imageModelPath + "/" + req.file.filename;
            req.body.subCategoryImage = imagePath;
        } else {
            req.body.subCategoryImage = oldData.subCategoryImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await SubCategory.findByIdAndUpdate(req.body.oldId, req.body);
        let subCategoryData = await SubCategory.findById(req.body.oldId);
        console.log("Data updated");
        return res.redirect("/admin/subCategory/view_subCategory");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
