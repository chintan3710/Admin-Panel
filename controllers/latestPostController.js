const fs = require("fs");

const path = require("path");

const LatestPost = require("../models/latestPost");

module.exports.add_latest_post = async (req, res) => {
    try {
        return res.render("add_latest_post");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertLatestPostData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = LatestPost.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.latestPostImage = imagePath;
            req.body.username = req.user.name;
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await LatestPost.create(req.body);
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

module.exports.view_latest_post = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalLatestPostData = await LatestPost.find({
            $or: [{ title: { $regex: ".*" + search + ".*", $options: "i" } }],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await LatestPost.find({
            $or: [{ title: { $regex: ".*" + search + ".*", $options: "i" } }],
        })
            .limit(perPage)
            .skip(perPage * page);
        let latestPostData = await LatestPost.find({});
        return res.render("view_latestPost", {
            latestPostData: latestPostData,
            search: search,
            totalDocument: Math.ceil(totalLatestPostData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeLatestPost = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await LatestPost.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Latest Post not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Latest Post not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveLatestPost = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await LatestPost.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Latest Post not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Latest Post not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
module.exports.deleteLatestPost = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await LatestPost.findById(req.params.id);
            if (oldData) {
                if (oldData.latestPostImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.latestPostImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("Latest Post image not found");
                }
            } else {
                console.log("Latest Post not found");
            }
            let data = await LatestPost.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Latest Post not delete");
            }
        } else {
            console.log("Latest Post not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
};

module.exports.updateLatestPost = async (req, res) => {
    try {
        let latestPostData = await LatestPost.findById(req.params.id);
        return res.render("update_latestPost", {
            latestPostData: latestPostData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editLatestPostData = async (req, res) => {
    try {
        let oldData = await LatestPost.findById(req.body.oldId);
        if (req.file) {
            if (oldData.latestPostImage) {
                let fullPath = path.join(
                    __dirname,
                    ".." + oldData.latestPostImage
                );
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = LatestPost.imageModelPath + "/" + req.file.filename;
            req.body.latestPostImage = imagePath;
            res.locals.user.latestPostImage = imagePath;
        } else {
            req.body.latestPostImage = oldData.latestPostImage;
        }
        await LatestPost.findByIdAndUpdate(req.body.oldId, req.body);
        let latestPostData = await LatestPost.findById(req.body.oldId);
        return res.redirect("/admin/latestPost/view_latest_post");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
