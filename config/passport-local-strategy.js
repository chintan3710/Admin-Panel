const passport = require("passport");

const PassportLocal = require("passport-local").Strategy;

const Admin = require("../models/admin");

passport.use(
    new PassportLocal(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            let adminData = await Admin.findOne({ email: email });
            console.log(email, password);
            if (adminData) {
                if (adminData.password == password) {
                    return done(null, adminData);
                } else {
                    return done(null, false);
                }
            } else {
                return done(null, false);
            }
        }
    )
);

passport.serializeUser(async (admin, done) => {
    return done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    let adminRecord = await Admin.findById(id);
    if (adminRecord) {
        return done(null, adminRecord);
    } else {
        return done(null, false);
    }
});

passport.setAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
};

passport.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect("/admin");
    }
};

module.exports = passport;
