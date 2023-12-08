const Offer = require("../models/offer");

module.exports.add_offer = async (req, res) => {
    try {
        return res.render("add_offer");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertOfferData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Offer.create(req.body);
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

module.exports.view_offer = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalOfferData = await Offer.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } }
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await Offer.find({
            $or: [
                { title: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        let offerData = await Offer.find({});
        return res.render("view_offer", {
            offerData: offerData,
            search: search,
            totalDocument: Math.ceil(totalOfferData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeOffer = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Offer.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Offer not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Offer not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deActiveOffer = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Offer.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Offer not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Offer not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteOffer = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await Offer.findById(req.params.id);
            if (oldData) {
                if (oldData.offerImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.offerImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("Offer image not found");
                }
            } else {
                console.log("Offer not found");
            }
            let data = await Offer.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Offer not delete");
            }
        } else {
            console.log("Offer not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
    return res.redirect("back");
};

module.exports.updateOffer = async (req, res) => {
    try {
        let offerData = await Offer.findById(req.params.id);
        return res.render("update_offer", {
            offerData: offerData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editOfferData = async (req, res) => {
    try {
        let oldData = await Offer.findById(req.body.oldId);
        if (req.file) {
            if (oldData.offerImage) {
                let fullPath = path.join(__dirname, ".." + oldData.offerImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = Offer.imageModelPath + "/" + req.file.filename;
            req.body.offerImage = imagePath;
            res.locals.user.offerImage = imagePath;
        } else {
            req.body.offerImage = oldData.offerImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await Offer.findByIdAndUpdate(req.body.oldId, req.body);
        let offerData = await Offer.findById(req.body.oldId);
        return res.redirect("/admin/offer/view_offer");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
