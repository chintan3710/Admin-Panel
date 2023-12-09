const path = require("path");

const fs = require("fs");

const nodemailer = require("nodemailer");

const Admin = require("../models/admin");

module.exports.dashboard = async (req, res) => {
    try {
        console.log(req.cookies.adminData);
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        // let data = req.cookies.adminData;
        return res.render("dashboard");
        // if (req.isAuthenticated()) {
        // } else {
        //     return res.redirect("/admin/");
        // }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.add_admin = async (req, res) => {
    try {
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        // let data = req.cookies.adminData;
        return res.render("add_admin");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.view_admin = async (req, res) => {
    try {
        let search = "";
        let page;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 0;
        }
        let perPage = 4;

        let totalAdminData = await Admin.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }).countDocuments();

        if (req.query.search) {
            search = req.query.search;
        }
        let adata = await Admin.find({
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(perPage)
            .skip(perPage * page);
        return res.render("view_admin", {
            data: adata,
            search: search,
            totalDocument: Math.ceil(totalAdminData / perPage),
            pageNo: parseInt(page),
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.insertData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = Admin.imageModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.name = req.body.fname + " " + req.body.lname;
            req.body.adminImage = imagePath;
            req.body.isActive = true;
            req.body.currentDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Admin.create(req.body);
            // console.log(data);
            res.cookie("adminData", data);
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

module.exports.activeData = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Admin.findByIdAndUpdate(req.params.id, {
                isActive: false,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Admin not deactivate");
                return res.redirect("back");
            }
        } else {
            console.log("Admin not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deactiveData = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Admin.findByIdAndUpdate(req.params.id, {
                isActive: true,
            });
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Admin not activate");
                return res.redirect("back");
            }
        } else {
            console.log("Admin not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        if (req.params.id) {
            let oldData = await Admin.findById(req.params.id);
            if (oldData) {
                if (oldData.adminImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + oldData.adminImage
                    );
                    await fs.unlinkSync(fullPath);
                } else {
                    console.log("Adminimage not found");
                }
            } else {
                console.log("Admin not found");
            }
            let data = await Admin.findByIdAndDelete(req.params.id);
            if (data) {
                return res.redirect("back");
            } else {
                console.log("Admin not delete");
            }
        } else {
            console.log("Admin not found");
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.redirect("back");
    }
    return res.redirect("back");
};

module.exports.updateAdmin = async (req, res) => {
    try {
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        let adminData = await Admin.findById(req.params.id);
        let data = res.locals.user;
        return res.render("update_admin", {
            data: adminData,
            adminData: data,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editData = async (req, res) => {
    try {
        console.log(req.body);
        let oldData = await Admin.findById(req.body.oldId);
        if (req.file) {
            if (oldData.adminImage) {
                let fullPath = path.join(__dirname, ".." + oldData.adminImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = Admin.imageModelPath + "/" + req.file.filename;
            req.body.adminImage = imagePath;
            res.locals.user.adminImage = imagePath;
        } else {
            req.body.adminImage = oldData.adminImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await Admin.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await Admin.findById(req.body.oldId);
        res.locals.user = adminData;
        return res.redirect("/admin/view_admin");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.loginAdmin = async (req, res) => {
    return res.redirect("/admin/dashboard");
};

module.exports.logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("RNW");
        return res.redirect("/admin");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.update_password = async (req, res) => {
    try {
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        // let data = req.cookies.adminData;
        return res.render("update_password");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editPassword = async (req, res) => {
    try {
        let data = res.locals.user;
        console.log(data);
        console.log(req.body);
        if (data) {
            if (data.password == req.body.cpassword) {
                if (req.body.cpassword != req.body.npassword) {
                    if (req.body.npassword == req.body.copassword) {
                        let allAdmin = await Admin.findById(data._id);
                        if (allAdmin) {
                            let editPass = await Admin.findByIdAndUpdate(
                                allAdmin.id,
                                { password: req.body.npassword }
                            );
                            if (editPass) {
                                return res.redirect("/admin/logoutAdmin");
                            } else {
                                console.log("Password not change");
                            }
                        } else {
                            console.log("Record not found");
                        }
                    } else {
                        console.log("Confirm password not match");
                    }
                } else {
                    console.log("This password has been already used");
                }
            } else {
                console.log("Password not match");
            }
        } else {
            console.log("Admin not found");
        }
        return res.redirect("back");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.profile = async (req, res) => {
    try {
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        // let data = req.cookies.adminData;
        return res.render("profile");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        // if (req.cookies.adminData == undefined) {
        //     return res.redirect("/admin");
        // }
        let adminData = await Admin.findById(req.params.id);
        let data = res.locals.user;
        return res.render("update_profile", {
            data: adminData,
            adminData: data,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.editProfile = async (req, res) => {
    try {
        let oldData = await Admin.findById(req.body.oldId);
        if (req.file) {
            if (oldData.adminImage) {
                let fullPath = path.join(__dirname, ".." + oldData.adminImage);
                await fs.unlinkSync(fullPath);
            }
            let imagePath = "";
            imagePath = Admin.imageModelPath + "/" + req.file.filename;
            req.body.adminImage = imagePath;
        } else {
            req.body.adminImage = oldData.adminImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        await Admin.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await Admin.findById(req.body.oldId);
        res.locals.user = adminData;
        return res.redirect("/admin/profile");
    } catch (err) {
        console.log(err);
        return res.redirect("/admin/profile");
    }
};

module.exports.checkMail = async (req, res) => {
    try {
        let checkMailData = Admin.findOne({ email: req.body.email });
        let otp = Math.round(100000 + Math.random() * 999999);
        if (checkMailData) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "chintanrajpara2041@gmail.com",
                    pass: "xtgnhkzovpjkfflx",
                },
            });
            const info = await transporter.sendMail({
                from: '"chintanrajpara2041@gmail.com',
                to: req.body.email,
                subject: "OTP",
                text: "Your OTP is here!",
                html: `<b>${otp}</b>`,
            });
            res.cookie("otp", otp);
            res.cookie("email", req.body.email);
            if (info) {
                console.log("Message sent successfully");
                return res.redirect("/admin/checkOTP");
            } else {
                console.log("Something went wrong");
                return res.redirect("back");
            }
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.checkOTP = async (req, res) => {
    return res.render("forgotPass/checkOTP");
};

module.exports.verifyOTP = async (req, res) => {
    // console.log(req.body.otp);
    // console.log(req.cookies.otp);
    try {
        // let data = await Admin.findOne({ email: req.cookies.email });
        if (req.body.otp == req.cookies.otp) {
            return res.redirect("/admin/changePass");
        } else {
            console.log("Enter valid OTP");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.verifyPass = async (req, res) => {
    try {
        let data = await Admin.findOne({ email: req.cookies.email });
        if (data) {
            let updateData = await Admin.findByIdAndUpdate(data.id, {
                password: req.body.npass,
            });
            console.log(updateData);
            if (updateData) {
                console.log("Password updated successfully");
                return res.redirect("/admin");
            } else {
                console.log("Password not updated");
                return res.redirect("back");
            }
        } else {
            console.log("Record not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

module.exports.mulDel = async (req, res) => {
    try {
        let dataArr = [];
        let arrDel = req.body.mulDelete;
        for (let i = 0; i < arrDel.length; i++) {
            let dd = await Admin.findById(arrDel[i]);
            console.log(dd);
            dataArr.push(dd);
        }
        let data = await Admin.deleteMany({ _id: { $in: req.body.mulDelete } });
        if (data) {
            for (let i = 0; i < dataArr.length; i++) {
                let fullPath = path.join(
                    __dirname,
                    ".." + dataArr[i].adminImage
                );
                await fs.unlinkSync(fullPath);
            }
            return res.redirect("back");
        } else {
            console.log("Image not deleted");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
