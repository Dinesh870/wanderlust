const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, login, logout, renderSignUpForm, renderLoginForm } = require("../controllers/user.js");

// router.route() method
router.route("/signup")
.get(renderSignUpForm)
.post(wrapAsync(signup));

router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), wrapAsync(login));


// router.get("/signup", renderSignUpForm);

// signup route
// router.post("/signup",  wrapAsync(signup));

// router.get("/login", renderLoginForm);

// login route
// router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), wrapAsync(login));

// logout route
router.get("/logout", logout);

module.exports = router;