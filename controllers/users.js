const User=require("../models/user");
module.exports.signUp=async(req,res,next)=>{

    try{
        let {username,email,password}=req.body;
        const newuser=new User({email,username});
        const registeredUser= await User.register(newuser,password);
        console.log(registeredUser);
        req.login(registeredUser,((err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome To WanderLust");
            res.redirect("/listings");
        }))

        

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");

    }
    



}
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");

}

module.exports.renderLogin=(req,res)=>{
    
    res.render("users/login.ejs");

}

module.exports.login=async(req,res)=>{
    req.flash("success","WElcome Back To WandeLust!");
    res.redirect(res.locals.redirectUrl);



}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged  out now");
        res.redirect("/listings");
    })

}