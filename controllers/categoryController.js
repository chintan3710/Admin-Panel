const Category = require("../models/category");

module.exports.add_category = async (req, res) => {
    try {
        return res.render("add_category");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertCategoryData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Category.create(req.body);
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

module.exports.view_category = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalCategoryData = await Category.find({
            $or: [
                { category: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await Category.find({
            $or: [
                { category: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        let categoryData = await Category.find({});
        return res.render("view_category", {
            categoryData: categoryData,
            search: search,
            totalDocument: Math.ceil(totalCategoryData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Category.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Category not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Category not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Category.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Category not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Category not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await Category.findById(req.params.id);
            if (oldData) {
                let data = await Category.findByIdAndDelete(req.params.id);
                if (data) {
                    console.log("Category deleted");
                    return res.redirect("back");
                } else {
                    console.log("Category not delete");
                    return res.redirect("back");
                }
            } else {
                console.log("Category not found");
                return res.redirect("back");
            }
        } else {
            console.log("Category not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
    return res.redirect("back");
};

module.exports.updateCategory = async (req, res) => {
    try {
        let categoryData = await Category.findById(req.params.id);
        return res.render("update_category", {
            categoryData: categoryData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editCategoryData = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.body.oldId, req.body);
        return res.redirect("/admin/category/view_category");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
