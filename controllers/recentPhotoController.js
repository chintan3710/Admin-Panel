const RecentPhoto = require("../models/recentPhoto");

const fs = require("fs");

const path = require("path");

module.exports.add_recentPhoto = (req, res) => {
    try {
        return res.render("add_recentPhoto");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertRecentPhotoData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = RecentPhoto.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.recentPhotoImage = imagePath;
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await RecentPhoto.create(req.body);
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

module.exports.view_recentPhoto = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalRecentPhotoData = await RecentPhoto.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await RecentPhoto.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        let recentPhotoData = await RecentPhoto.find({});
        return res.render("view_recentPhoto", {
            recentPhotoData: recentPhotoData,
            search: search,
            totalDocument: Math.ceil(totalRecentPhotoData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeRecentPhoto = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await RecentPhoto.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("RecentPhoto not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("RecentPhoto not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveRecentPhoto = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await RecentPhoto.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("RecentPhoto not activate");
                return res.redirect("back");
            }
        } else {
            console.log("RecentPhoto not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteRecentPhoto = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await RecentPhoto.findById(req.params.id);
            if (oldData) {
                if (oldData.recentPhotoImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.recentPhotoImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("RecentPhoto image not found");
                }
            } else {
                console.log("RecentPhoto not found");
            }
            let data = await RecentPhoto.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("RecentPhoto not delete");
            }
        } else {
            console.log("RecentPhoto not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
};

module.exports.updateRecentPhoto = async (req, res) => {
    try {
        let recentPhotoData = await RecentPhoto.findById(req.params.id);
        return res.render("update_recentPhoto", {
            recentPhotoData: recentPhotoData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editRecentPhoto = async (req, res) => {
    try {
        let oldData = await RecentPhoto.findById(req.body.oldId);
        if (req.file) {
            if (oldData.recentPhotoImage) {
                let fullPath = path.join(__dirname, ".." + oldData.recentPhotoImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = RecentPhoto.imageModelPath + "/" + req.file.filename;
            req.body.recentPhotoImage = imagePath;
            res.locals.user.recentPhotoImage = imagePath;
        } else {
            req.body.recentPhotoImage = oldData.recentPhotoImage;
        }
        await RecentPhoto.findByIdAndUpdate(req.body.oldId, req.body);
        let recentPhotoData = await RecentPhoto.findById(req.body.oldId);
        return res.redirect("/admin/recentPhoto/view_recentPhoto");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
