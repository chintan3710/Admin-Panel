const fs = require("fs");

const path = require("path");

const nodemailer = require("nodemailer");

const Slider = require("../models/slider");

const Offer = require("../models/offer");

const RecentPhoto = require("../models/recentPhoto");

const Testimonial = require("../models/testimonial");

const LatestPost = require("../models/latestPost");

const Comment = require("../models/comment");

const SubCategory = require("../models/subCategory");

const Category = require("../models/category");

const Contact = require("../models/contact");

module.exports.home = async (req, res) => {
    // console.log("Home Page");
    try {
        let sliderData = await Slider.find({});
        let offerData = await Offer.find({});
        let recentPhotoData = await RecentPhoto.find({});
        let testimonialData = await Testimonial.find({});
        let latestPostData = await LatestPost.find({});
        return res.render("user/home", {
            sliderData: sliderData,
            offerData: offerData,
            recentPhotoData: recentPhotoData,
            testimonialData: testimonialData,
            latestPostData: latestPostData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.single_post = async (req, res) => {
    try {
        if (req.params.id) {
            let allPostId = await LatestPost.find();
            let idArr = [];
            allPostId.map((v, i) => {
                idArr.push(v.id);
            });
            let next;
            for (let i = 0; i < idArr.length; i++) {
                if (idArr[i] === req.params.id) {
                    next = i;
                    break;
                }
            }

            let singlePostData = await LatestPost.findById(req.params.id);
            let commentsData = await Comment.find({});
            let recentPost = await LatestPost.find({})
                .sort({ id: -1 })
                .limit(3);
            if (singlePostData) {
                return res.render("user/blog_single", {
                    singlePostData: singlePostData,
                    commentsData: commentsData,
                    allId: idArr,
                    pos: next,
                    recentPost: recentPost,
                });
            } else {
                console.log("Record not found");
                return res.redirect("back");
            }
        } else {
            console.log("Invalid Request");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.addcomment = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = Comment.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.userImage = imagePath;
            req.body.isActive = false;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Comment.create(req.body);
            return res.redirect("back");
        } else {
            console.log("Data Not Found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.threeCol = async (req, res) => {
    try {
        let subCategoryData = await SubCategory.find({});
        let categoryData = await Category.find({});

        return res.render("user/threeCol", {
            categoryData: categoryData,
            subCategoryData: subCategoryData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.contact = async (req, res) => {
    try {
        return res.render("user/contact");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertContactData = async (req, res) => {
    try {
        const ejsTemplate = fs.readFileSync(
            path.join(__dirname, "../templetes/contact.ejs"),
            "utf8"
        );
        // console.log(ejsTemplate);
        if (req.body) {
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Contact.create(req.body);
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "yom.no.replay@gmail.com",
                    pass: "tidlbkhlfsnktjdn",
                },
            });
            const info = await transporter.sendMail({
                from: "yom.no.replay@gmail.com",
                to: req.body.email,
                subject: "Connect with YOM",
                html: ejsTemplate,
            });
            return res.redirect("back");
        } else {
            console.log("Data not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
