const fs = require("fs");

const path = require("path");

const Slider = require("../models/slider");

module.exports.add_slider = (req, res) => {
    try {
        return res.render("add_slider");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertSliderData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = Slider.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.sliderImage = imagePath;
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Slider.create(req.body);
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

module.exports.view_slider = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalSliderData = await Slider.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let sliderData = await Slider.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        return res.render("view_slider", {
            sliderData: sliderData,
            search: search,
            totalDocument: Math.ceil(totalSliderData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeSlider = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Slider.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Slider not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Slider not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveSlider = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Slider.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Slider not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Slider not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteSlider = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await Slider.findById(req.params.id);
            if (oldData) {
                if (oldData.sliderImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.sliderImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("Slider image not found");
                }
            } else {
                console.log("Slider not found");
            }
            let data = await Slider.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Slider not delete");
            }
        } else {
            console.log("Slider not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
};

module.exports.updateSlider = async (req, res) => {
    try {
        let sliderData = await Slider.findById(req.params.id);
        return res.render("update_slider", {
            sliderData: sliderData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editSliderData = async (req, res) => {
    try {
        let oldData = await Slider.findById(req.body.oldId);
        if (req.file) {
            if (oldData.sliderImage) {
                let fullPath = path.join(__dirname, ".." + oldData.sliderImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = Slider.imageModelPath + "/" + req.file.filename;
            req.body.sliderImage = imagePath;
            res.locals.user.sliderImage = imagePath;
        } else {
            req.body.sliderImage = oldData.sliderImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await Slider.findByIdAndUpdate(req.body.oldId, req.body);
        let sliderData = await Slider.findById(req.body.oldId);
        return res.redirect("/admin/slider/view_slider");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
