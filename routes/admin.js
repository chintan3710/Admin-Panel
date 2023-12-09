const express = require("express");

const Passport = require("passport");

const adminController = require("../controllers/adminController");

const Admin = require("../models/admin");

const routes = express.Router();

routes.get("/", async (req, res) => {
    let data = res.locals.user;
    if (data) {
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("login");
    }
});

routes.get("/dashboard", Passport.checkAuth, adminController.dashboard);

routes.get("/add_admin", Passport.checkAuth, adminController.add_admin);

routes.get("/view_admin", Passport.checkAuth, adminController.view_admin);

routes.post("/insertData", Admin.adminUploadImage, adminController.insertData);

routes.get("/activeData/:id", adminController.activeData);

routes.get("/deactiveData/:id", adminController.deactiveData);

routes.get("/deleteAdmin/:id", adminController.deleteAdmin);

routes.get("/updateAdmin/:id", adminController.updateAdmin);

routes.post("/editData", Admin.adminUploadImage, adminController.editData);

routes.post(
    "/loginAdmin",
    Passport.authenticate("local", { failureRedirect: "/admin" }),
    adminController.loginAdmin
);

routes.get("/logoutAdmin", adminController.logoutAdmin);

routes.get("/update_password", adminController.update_password);

routes.post("/editPassword", adminController.editPassword);

routes.get("/profile", Admin.adminUploadImage, adminController.profile);

routes.get("/updateProfile/:id", adminController.updateProfile);

routes.post(
    "/editProfile",
    Admin.adminUploadImage,
    adminController.editProfile
);

routes.get("/mailPage", async (req, res) => {
    return res.render("forgotPass/emailPage");
});

routes.post("/checkMail", adminController.checkMail); // mail page form

routes.get("/checkOTP", adminController.checkOTP); // otp page render

routes.post("/verifyOTP", adminController.verifyOTP); // check otp on form

routes.get("/changePass", async (req, res) => {
    return res.render("forgotPass/changePass");
});

routes.post("/verifyPass", adminController.verifyPass); // password change in db

routes.post("/mulDel", adminController.mulDel);

routes.use("/slider", Passport.checkAuth, require("./slider"));

routes.use("/offer", Passport.checkAuth, require("./offer"));

routes.use("/recentPhoto", Passport.checkAuth, require("./recentPhoto"));

routes.use("/testimonial", Passport.checkAuth, require("./testimonial"));

routes.use("/latestPost", Passport.checkAuth, require("./latestPost"));

routes.use("/category", Passport.checkAuth, require("./category"));

routes.use("/subCategory", Passport.checkAuth, require("./subCategory"));

module.exports = routes;
