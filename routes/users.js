const express=require("express");
const router=express.Router();
const passport=require("passport");

const wrapAsync=require("../utils/wrapAsync.js");
const usersCollection = require("../collections/users");


router.get("/signup",(req,res)=>
{
         res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>
{
       let  { username,password,email}=req.body;
       const registereduser= await usersCollection.registerUser(username, email, password);
       
     req.login(registereduser,(err)=>{
       if(err) {
         return next(err);
       }
       req.flash("success","Account created successfully!");
       res.redirect("/listings");
     });
}));

router.get("/login",(req,res)=>
{
     res.render("users/login.ejs");
});

const { saveRedirectUrl } = require("../isloggedin");

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  }
);
router.get("/logout",(req,res,next)=>
{
     req.logout((err)=>{
       if(err) {
         return next(err);
       }
       req.flash("success","logout successfully");
       res.redirect("/listings");
     });
});
module.exports = router;