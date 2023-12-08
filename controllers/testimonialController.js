const Testimonial = require("../models/testimonial");

module.exports.add_testimonial = async (req, res) => {
    try {
        return res.render("add_testimonial");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertTestimonialData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Testimonial.create(req.body);
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

module.exports.view_testimonial = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalTestimonialData = await Testimonial.find({
            $or: [
                { author: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await Testimonial.find({
            $or: [
                { author: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        let testimonialData = await Testimonial.find({});
        return res.render("view_testimonial", {
            testimonialData: testimonialData,
            search: search,
            totalDocument: Math.ceil(totalTestimonialData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeTestimonial = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Testimonial.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Testimonial not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Testimonial not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveTestimonial = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Testimonial.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Testimonial not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Testimonial not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteTestimonial = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await Testimonial.findById(req.params.id);
            if (oldData) {
                if (oldData.testimonialImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.testimonialImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("Testimonial image not found");
                }
            } else {
                console.log("Testimonial not found");
            }
            let data = await Testimonial.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Testimonial not delete");
            }
        } else {
            console.log("Testimonial not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
    return res.redirect("back");
};

module.exports.updateTestimonial = async (req, res) => {
    try {
        let testimonialData = await Testimonial.findById(req.params.id);
        return res.render("update_testimonial", {
            testimonialData: testimonialData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editTestimonialData = async (req, res) => {
    try {
        let oldData = await Testimonial.findById(req.body.oldId);
        if (req.file) {
            if (oldData.testimonialImage) {
                let fullPath = path.join(__dirname, ".." + oldData.testimonialImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = Testimonial.imageModelPath + "/" + req.file.filename;
            req.body.testimonialImage = imagePath;
            res.locals.user.testimonialImage = imagePath;
        } else {
            req.body.testimonialImage = oldData.testimonialImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await Testimonial.findByIdAndUpdate(req.body.oldId, req.body);
        let testimonialData = await Testimonial.findById(req.body.oldId);
        return res.redirect("/admin/testimonial/view_testimonial");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
