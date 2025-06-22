const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirect}=require("../middleware.js");
const userControllers=require("../controllers/users.js")
//render Signup form
router.get("/signup",userControllers.renderSignupForm);
//post signup
router.post("/signup",wrapAsync(userControllers.signUp));


//login
router.get("/login",userControllers.renderLogin);

router.post("/login",saveRedirect, passport.authenticate("local",{ failureRedirect: '/login',failureFlash:true }),userControllers.login);



router.get("/logout",userControllers.logout);

module.exports=router;