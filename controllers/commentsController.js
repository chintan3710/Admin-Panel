const Comment = require("../models/comment");

module.exports.view_comments = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalCommentsData = await Comment.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let commentsData = await Comment.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page)
            .populate("postId")
            .exec();
        console.log(commentsData);
        // console.log(postData);
        return res.render("view_comments", {
            commentsData: commentsData,
            search: search,
            totalDocument: Math.ceil(totalCommentsData / perPage),
            pageNo: parseInt(page),
            // postData: postData,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.activeComment = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Comment.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Comment not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Comment not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deactiveComment = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Comment.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Comment not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Comment not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
