if(process.env.NODE_ENV!="production"){
    require('dotenv').config()

}


const express=require("express")
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const { count, error } = require("console");
const ejs_mate=require("ejs-mate");
app.engine('ejs', ejs_mate);
const methodOverride = require('method-override');
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const searchRouter=require("./routes/search.js");

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")))
app.set("views",path.join(__dirname,"views"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const dbURl=process.env.ATLASDB_URL;

main()
.then(()=>{console.log("coonected to database")})
.catch(err => console.log(err));



async function main() {
  await mongoose.connect(dbURl);

  
} 

// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// })

const store=MongoStore.create({
     mongoUrl:dbURl,
    crypto: {
    secret: process.env.SECRET
     },
    touchAfter:24*3600,

})

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})
app.use(session({
    store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
   cookie: {
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
   }
}));









app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//flash message
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//search
// // GET /listings/search?country=India
// app.get("/listings/search", async (req, res) => {
//     let { search } = req.query;
//     console.log(search)
//     const allListings = await Listing.find({  country: { $regex: search, $options: "i" }});
//     console.log(allListings);
//     if(allListings.length==0){
//         req.flash("error"," No listings found for the selected country")
//         return res.redirect("/listings");

//     }
//     search=""
//     res.render("listings/index", { allListings });
// });


app.use("/",searchRouter);




//listing route
app.use("/listings",listingsRouter);

//all review route
app.use("/listings/:id/reviews",reviewsRouter);

//sign up route
app.use("/",userRouter);

//if no path found 
app.use((req, res, next) => {
    const message="Page Not Found"
    res.status(404).render("error.ejs",{message});
});
//error handler middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})